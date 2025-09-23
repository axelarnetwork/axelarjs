import {
  INTERCHAIN_TOKEN_FACTORY_ENCODERS,
  INTERCHAIN_TOKEN_SERVICE_ENCODERS,
} from "@axelarjs/evm";
import { invariant, throttle } from "@axelarjs/utils";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { zeroAddress } from "viem";
import { useWaitForTransactionReceipt } from "wagmi";

import {
  CHAIN_IDS_WITH_REGISTERED_TOKEN_ADDRESS,
  HEDERA_CHAIN_ID,
  STELLAR_CHAIN_ID,
  SUI_CHAIN_ID,
} from "~/config/chains";
import { useHederaDeployment } from "~/features/hederaHooks";
import { useDeployStellarToken } from "~/features/stellarHooks/useDeployStellarToken";
import useDeployToken from "~/features/suiHooks/useDeployToken";
import { useReadInterchainTokenServiceRegisteredTokenAddress } from "~/lib/contracts/hedera/HederaInterchainTokenService.hooks";
import {
  useReadInterchainTokenFactoryInterchainTokenId,
  useSimulateInterchainTokenFactoryMulticall,
  useWriteInterchainTokenFactoryMulticall,
} from "~/lib/contracts/InterchainTokenFactory.hooks";
import { useReadInterchainTokenServiceInterchainTokenAddress } from "~/lib/contracts/InterchainTokenService.hooks";
import {
  decodeDeploymentMessageId,
  type DeploymentMessageId,
} from "~/lib/drizzle/schema";
import { TOKEN_MANAGER_TYPES } from "~/lib/drizzle/schema/common";
import { useAccount, useChainId } from "~/lib/hooks";
import { useStellarKit } from "~/lib/providers/StellarWalletKitProvider";
import { trpc } from "~/lib/trpc";
import { scaleGasValue } from "~/lib/utils/gas";
import { isValidEVMAddress } from "~/lib/utils/validation";
import type { EstimateGasFeeMultipleChainsOutput } from "~/server/routers/axelarjsSDK";
import { RecordInterchainTokenDeploymentInput } from "~/server/routers/interchainToken/recordInterchainTokenDeployment";
import { useAllChainConfigsQuery } from "~/services/axelarConfigs/hooks";
import type { DeployAndRegisterTransactionState } from "../InterchainTokenDeployment.state";

// In an effort to keep the codebase without hardcoded chains, we create lists of chains up here
/** a token address is not needed in advance if the chain name includes the following strings */
const CHAINS_WITHOUT_TOKEN_ADDRESS = ["sui", "stellar", "hedera"];
/** chains that don't have their deployment draft recorded - check if chain name includes any of these strings */
const CHAIN_IDS_SKIP_DEPLOYMENT_DRAFT_RECORDING = ["sui", "stellar"];
/** a multicall is not needed for these chains */
const CHAIN_IDS_WITHOUT_MULTICALL = [SUI_CHAIN_ID];
/** a multicall is enabled manually for these chains */
const CHAIN_IDS_WITH_MANUAL_MULTICALL = [HEDERA_CHAIN_ID];

// Helper functions to check if chain names include specific strings
const isChainWithoutTokenAddress = (chainName: string | undefined): boolean =>
  !!chainName &&
  CHAINS_WITHOUT_TOKEN_ADDRESS.some((chainString) =>
    chainName.toLowerCase().includes(chainString.toLowerCase())
  );

const isChainSkipDeploymentDraftRecording = (
  chainId: string | undefined
): boolean =>
  !!chainId &&
  CHAIN_IDS_SKIP_DEPLOYMENT_DRAFT_RECORDING.some((chainString) =>
    chainId.toLowerCase().includes(chainString.toLowerCase())
  );

/*
 * INTERCHAIN TOKEN DEPLOYMENT FLOW
 * =================================
 *
 * 1. INPUT VALIDATION & SETUP
 *    └── useTokenId() ──────────────► Get token ID from salt + deployer
 *    └── useTokenAddress() ──────────► Get token address from token ID (supports registered tokens for Hedera)
 *    └── useDestinationChainIds() ───► Map destination chains to IDs
 *
 * 2. MULTICALL PREPARATION
 *    └── usePrepareMulticall() ──────► Build encoded function calls and prepare simulation
 *    └── useSimulateInterchainTokenFactoryMulticall() ──► Prepare transaction simulation
 *
 * 3. READINESS CHECK
 *    └── useReady() ─────────────────► Check if deployment is ready (excludes Hedera manual multicall)
 *
 * 4. DRAFT DEPLOYMENT RECORDING
 *    └── recordDeploymentDraft() ────► Record deployment draft in DB
 *
 * 5. DEPLOYMENT EXECUTION
 *    ├── Stellar: deployStellar() ────► Deploy on Stellar network
 *    ├── Sui: deploySui() ────────────► Deploy on Sui network
 *    ├── Hedera: deployHedera() ──────► Deploy on Hedera (WHBAR deposit + approval + multicall)
 *    └── EVM: multicall.writeContractAsync() ──► Deploy via multicall
 *
 * 6. TRANSACTION MONITORING
 *    └── useReceipt() ────────────────► Wait for transaction receipt (with deduplication)
 *
 * 7. FINAL DEPLOYMENT RECORDING
 *    └── useSetEvmDeploymentArgsOnReceipt() ──► Set deployment args when receipt is received
 *    └── useRecordDeployment() ───────► Record final deployment in database
 *
 * 8. STATUS UPDATES
 *    └── onStatusUpdate() ────────────► Update UI with progress
 *
 * NETWORK-SPECIFIC INTEGRATIONS:
 * ==============================
 *
 * HEDERA:
 * - Uses useHederaDeployment() hook which handles:
 *   - WHBAR deposit (if balance insufficient)
 *   - WHBAR approval (if allowance insufficient)
 *   - Token deployment via multicall
 * - Related files: ~/features/hederaHooks/
 *
 * STELLAR:
 * - Uses useDeployStellarToken() hook which handles:
 *   - Stellar wallet connection via StellarKit
 *   - Token creation on Stellar network
 *   - Remote token registration
 * - Related files: ~/features/stellarHooks/
 *
 * SUI:
 * - Uses useDeployToken() hook which handles:
 *   - Token deployment on Sui network
 *   - Event parsing for deployment results
 *   - Direct deployment recording (no multicall)
 * - Related files: ~/features/suiHooks/
 */

type Multicall = ReturnType<typeof useWriteInterchainTokenFactoryMulticall>;
type PrepareMulticallRequest = Parameters<Multicall["writeContractAsync"]>[0];

// Sui event data type
interface SuiEventData {
  token_id?: {
    id: string;
  };
  token_address?: string;
  token_manager_address?: string;
  token_manager_type?: string;
}

export interface UseDeployAndRegisterInterchainTokenInput {
  sourceChainId: string;
  tokenName: string;
  tokenSymbol: string;
  decimals: number;
  destinationChainIds: string[];
  remoteDeploymentGasFees?: EstimateGasFeeMultipleChainsOutput;
  initialSupply?: bigint;
  salt: `0x${string}`;
  minterAddress?: string;
}

export interface UseDeployAndRegisterRemoteInterchainTokenConfig {
  onStatusUpdate?: (message: DeployAndRegisterTransactionState) => void;
  onFinished?: () => void;
}

interface UseMulticallParams {
  input: UseDeployAndRegisterInterchainTokenInput | undefined;
  tokenId: `0x${string}` | undefined;
  destinationChainIds: string[];
  chainId: number;
}

const usePrepareMulticall = ({
  input,
  tokenId,
  destinationChainIds,
  chainId,
}: UseMulticallParams) => {
  const multicallArgs = useMemo(() => {
    if (!input || !tokenId || CHAIN_IDS_WITHOUT_MULTICALL.includes(chainId)) {
      return [];
    }

    const minter = input?.minterAddress ?? zeroAddress;
    const commonArgs = {
      salt: input.salt,
    };

    const deployTxData =
      INTERCHAIN_TOKEN_FACTORY_ENCODERS.deployInterchainToken.data({
        ...commonArgs,
        minter: minter as `0x${string}`,
        initialSupply: input.initialSupply || 0n,
        name: input.tokenName,
        symbol: input.tokenSymbol,
        decimals: input.decimals,
      });

    if (!input.destinationChainIds.length) {
      // early return case, no remote chains
      return [deployTxData];
    }

    const registerTxData = destinationChainIds.map((destinationChain, i) =>
      INTERCHAIN_TOKEN_FACTORY_ENCODERS.deployRemoteInterchainToken.data({
        ...commonArgs,
        destinationChain,
        gasValue: scaleGasValue(
          chainId,
          input.remoteDeploymentGasFees?.gasFees?.[i].fee
        ),
      })
    );

    return [deployTxData, ...registerTxData];
  }, [input, tokenId, destinationChainIds, chainId]);

  const totalGasFee = input?.remoteDeploymentGasFees?.totalGasFee ?? 0n;

  const [isTokenReadyForMulticall, setIsTokenReadyForMulticall] =
    useState(false);

  useEffect(() => {
    setIsTokenReadyForMulticall(
      !CHAIN_IDS_WITH_MANUAL_MULTICALL.includes(chainId)
    );
  }, [chainId]);

  // enable if there are no remote chains or if there are remote chains and the total gas fee is greater than 0
  const isDestinationFeeSet = !destinationChainIds.length || totalGasFee > 0n;
  const isMutationReady =
    multicallArgs.length > 0 && isDestinationFeeSet && isTokenReadyForMulticall;

  const { data: prepareMulticall, error: simulationError } =
    useSimulateInterchainTokenFactoryMulticall({
      chainId,
      value: totalGasFee,
      args: [multicallArgs],
      query: {
        enabled: isMutationReady,
      },
    });

  if (simulationError) {
    console.error(
      "useDeployAndRegisterRemoteInterchainTokenMutation simulation error:",
      simulationError
    );
  }

  return {
    prepareMulticall,
    setIsTokenReadyForMulticall,
  };
};

const useTokenId = (
  input: UseDeployAndRegisterInterchainTokenInput | undefined,
  deployerAddress: `0x${string}`
) => {
  const { data: tokenId } = useReadInterchainTokenFactoryInterchainTokenId({
    args: INTERCHAIN_TOKEN_FACTORY_ENCODERS.interchainTokenId.args({
      salt: input?.salt as `0x${string}`,
      deployer: deployerAddress,
    }),
    query: {
      enabled:
        input?.salt && deployerAddress && isValidEVMAddress(deployerAddress),
    },
  });
  return tokenId;
};

interface UseTokenAddressParams {
  tokenId: `0x${string}` | undefined;
  chainName: string | undefined;
  chainId: number;
  multicall: Multicall | undefined;
}

const useTokenAddress = ({
  tokenId,
  chainName,
  chainId,
  multicall,
}: UseTokenAddressParams) => {
  const isWithTokenAddress = !isChainWithoutTokenAddress(chainName);
  const isWithRegisteredTokenAddress =
    CHAIN_IDS_WITH_REGISTERED_TOKEN_ADDRESS.includes(chainId);

  const receipt = useReceipt({
    multicall,
    enabled: Boolean(tokenId) && isWithRegisteredTokenAddress,
  });

  const { data: tokenAddress } =
    useReadInterchainTokenServiceInterchainTokenAddress({
      args: INTERCHAIN_TOKEN_SERVICE_ENCODERS.interchainTokenAddress.args({
        tokenId: tokenId as `0x${string}`,
      }),
      query: {
        enabled:
          Boolean(tokenId) &&
          isWithTokenAddress &&
          !isWithRegisteredTokenAddress,
      },
    });

  const { data: registeredTokenAddress } =
    useReadInterchainTokenServiceRegisteredTokenAddress({
      args: INTERCHAIN_TOKEN_SERVICE_ENCODERS.registeredTokenAddress.args({
        tokenId: tokenId as `0x${string}`,
      }),
      query: {
        enabled: Boolean(tokenId) && isWithRegisteredTokenAddress && !!receipt,
      },
    });

  return tokenAddress ?? registeredTokenAddress;
};

interface UseDestinationChainIdsParams {
  input: UseDeployAndRegisterInterchainTokenInput | undefined;
  chainId: number;
  combinedComputed: any;
}

const useDestinationChainIds = ({
  input,
  chainId,
  combinedComputed,
}: UseDestinationChainIdsParams) => {
  const { destinationChainIds } = useMemo(() => {
    const index = combinedComputed.indexedById;
    const originalChain = index[input?.sourceChainId ?? chainId];
    const originalChainName = originalChain?.chain_name ?? "Unknown";
    const destinationChainIds =
      input?.destinationChainIds.map(
        (destinationChainId) => index[destinationChainId]?.id ?? "Unknown"
      ) ?? [];

    return {
      originalChainName,
      destinationChainIds,
    };
  }, [
    chainId,
    input?.destinationChainIds,
    input?.sourceChainId,
    combinedComputed.indexedById,
  ]);

  return { destinationChainIds };
};

interface UseReadyParams {
  input: UseDeployAndRegisterInterchainTokenInput | undefined;
  tokenId: `0x${string}` | undefined;
  tokenAddress: `0x${string}` | undefined;
  deployerAddress: string;
  prepareMulticallRequest: PrepareMulticallRequest | undefined;
  setIsReady: (isReady: boolean) => void;
  chainId: number;
}

/** sets isReady to true if the deployment is ready */
const useReady = ({
  input,
  tokenId,
  tokenAddress,
  deployerAddress,
  prepareMulticallRequest,
  setIsReady,
  chainId,
}: UseReadyParams) => {
  useEffect(() => {
    if (
      isValidEVMAddress(deployerAddress) &&
      !prepareMulticallRequest &&
      chainId !== HEDERA_CHAIN_ID
    ) {
      setIsReady(false);
      console.warn("Failed to simulate multicall for deploying remote tokens");
      return;
    }

    if (
      (!tokenId || !tokenAddress) &&
      input &&
      !isChainWithoutTokenAddress(input?.sourceChainId)
    ) {
      setIsReady(false);
      return;
    }

    setIsReady(true);
  }, [
    input,
    tokenId,
    deployerAddress,
    tokenAddress,
    input?.sourceChainId,
    prepareMulticallRequest,
    setIsReady,
    chainId,
  ]);
};

interface UseReceiptParams {
  multicall: Multicall | undefined;
  enabled?: boolean;
}

const useReceipt = ({ multicall, enabled }: UseReceiptParams) => {
  const { data: receipt } = useWaitForTransactionReceipt({
    hash: multicall?.data,
    query: {
      enabled: Boolean(multicall?.data) && enabled,
    },
  });
  return receipt;
};

interface UseSetEvmDeploymentArgsOnReceiptParams {
  input: UseDeployAndRegisterInterchainTokenInput | undefined;
  tokenId: `0x${string}` | undefined;
  tokenAddress: `0x${string}` | undefined;
  deployerAddress: string;
  multicall: Multicall;
  setRecordDeploymentArgs: (args: RecordInterchainTokenDeploymentInput) => void;
}

const useSetEvmDeploymentArgsOnReceipt = ({
  input,
  tokenId,
  tokenAddress,
  deployerAddress,
  multicall,
  setRecordDeploymentArgs,
}: UseSetEvmDeploymentArgsOnReceiptParams) => {
  const receipt = useReceipt({ multicall });

  // Track processed transactions to prevent duplicates
  const processedTransactions = useRef(new Set<string>());

  useEffect(() => {
    if (!receipt) return;

    const { transactionHash: txHash, transactionIndex: txIndex } = receipt;

    if (!txHash || !tokenAddress || !tokenId || !deployerAddress || !input) {
      return;
    }

    // Create unique key for this transaction
    const transactionKey = `${txHash}-${txIndex}`;

    // Check if we've already processed this transaction
    if (processedTransactions.current.has(transactionKey)) {
      return;
    }

    // Mark this transaction as processed
    processedTransactions.current.add(transactionKey);

    setRecordDeploymentArgs({
      kind: "interchain",
      deploymentMessageId: transactionKey,
      tokenId: tokenId as string,
      tokenAddress,
      deployerAddress,
      salt: input.salt,
      tokenName: input.tokenName,
      tokenSymbol: input.tokenSymbol,
      tokenDecimals: input.decimals,
      axelarChainId: input.sourceChainId,
      originalMinterAddress: input.minterAddress,
      destinationAxelarChainIds: input.destinationChainIds,
      tokenManagerAddress: "",
    });
  }, [
    receipt,
    tokenAddress,
    tokenId,
    deployerAddress,
    input,
    setRecordDeploymentArgs,
  ]);
};

interface UseRecordDeploymentParams {
  input: UseDeployAndRegisterInterchainTokenInput | undefined;
  tokenId: `0x${string}` | undefined;
  tokenAddress: `0x${string}` | undefined;
  deployerAddress: string;
  recordDeploymentArgs: RecordInterchainTokenDeploymentInput | undefined;
  recordDeploymentAsync: (
    args: RecordInterchainTokenDeploymentInput
  ) => Promise<void>;
  onStatusUpdate: (status: DeployAndRegisterTransactionState) => void;
}

const useRecordDeployment = ({
  input,
  tokenId,
  tokenAddress,
  deployerAddress,
  recordDeploymentArgs,
  recordDeploymentAsync,
  onStatusUpdate,
}: UseRecordDeploymentParams) => {
  useEffect(
    () => {
      if (!recordDeploymentArgs) {
        return;
      }

      recordDeploymentAsync(recordDeploymentArgs)
        .then(() => {
          const tx = decodeDeploymentMessageId(
            recordDeploymentArgs.deploymentMessageId as DeploymentMessageId
          );
          onStatusUpdate({
            type: "deployed",
            tokenAddress: recordDeploymentArgs.tokenAddress as `0x${string}`,
            txHash: tx.hash,
          });
        })
        .catch((e: Error) => {
          console.error(
            "useDeployAndRegisterRemoteInterchainTokenMutation: unable to record tx",
            e
          );
          onStatusUpdate({
            type: "idle",
          });
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [recordDeploymentArgs]
  );

  const recordDeploymentDraft = useCallback(async () => {
    if (
      !input ||
      !tokenAddress ||
      isChainSkipDeploymentDraftRecording(input.sourceChainId)
    ) {
      return;
    }

    return await recordDeploymentAsync({
      kind: "interchain",
      tokenId: tokenId as string,
      deployerAddress,
      tokenAddress,
      tokenName: input.tokenName,
      tokenSymbol: input.tokenSymbol,
      tokenDecimals: input.decimals,
      axelarChainId: input.sourceChainId,
      salt: input.salt,
      originalMinterAddress: input.minterAddress,
      destinationAxelarChainIds: input.destinationChainIds,
      deploymentMessageId: "",
      tokenManagerAddress: "",
    });
  }, [deployerAddress, input, recordDeploymentAsync, tokenAddress, tokenId]);

  return { recordDeploymentDraft };
};

interface UseRequestDeployTokenParams {
  input: UseDeployAndRegisterInterchainTokenInput | undefined;
  recordDeploymentDraft: () => Promise<void>;
  chainId: number;
  deployerAddress: string;
  config: UseDeployAndRegisterRemoteInterchainTokenConfig;
  setRecordDeploymentArgs: (args: RecordInterchainTokenDeploymentInput) => void;
  prepareMulticallRequest: PrepareMulticallRequest | undefined;
  multicall: Multicall;
  setIsTokenReadyForMulticall: (isTokenReadyForMulticall: boolean) => void;
}

const useRequestDeployToken = ({
  input,
  recordDeploymentDraft,
  chainId,
  deployerAddress,
  config,
  setRecordDeploymentArgs,
  prepareMulticallRequest,
  multicall,
  setIsTokenReadyForMulticall,
}: UseRequestDeployTokenParams) => {
  const { address } = useAccount();
  const { kit } = useStellarKit();

  const { deployToken } = useDeployToken();

  const { deployStellarToken } = useDeployStellarToken();

  const deployGenericEVM = useCallback(async () => {
    invariant(
      prepareMulticallRequest !== undefined,
      "useDeployAndRegisterRemoteInterchainTokenMutation: prepareMulticall?.request is not defined"
    );

    return multicall.writeContractAsync(prepareMulticallRequest);
  }, [prepareMulticallRequest, multicall]);

  const { deployHedera } = useHederaDeployment({
    prepareMulticallRequest,
    multicall,
    setIsTokenReadyForMulticall,
  });

  const deployStellar = useCallback(async () => {
    if (!input) {
      throw new Error("Input is not defined");
    }

    try {
      const gasValues =
        input?.remoteDeploymentGasFees?.gasFees?.map((x) => BigInt(x.fee)) ??
        [];

      if (!address || !kit) {
        throw new Error(
          "Stellar wallet not connected or public key not available."
        );
      }

      const result = await deployStellarToken({
        kit: kit as any,
        tokenName: input.tokenName,
        tokenSymbol: input.tokenSymbol,
        decimals: input.decimals,
        initialSupply: input.initialSupply || 0n,
        salt: input.salt,
        minterAddress: input.minterAddress,
        destinationChainIds: input.destinationChainIds,
        gasValues: gasValues,
        onStatusUpdate: config.onStatusUpdate,
      });

      if (result) {
        setRecordDeploymentArgs({
          kind: "interchain",
          tokenId: result.tokenId,
          deployerAddress: deployerAddress,
          tokenAddress: result.tokenAddress,
          tokenName: input.tokenName,
          tokenSymbol: input.tokenSymbol,
          tokenDecimals: input.decimals,
          axelarChainId: input.sourceChainId,
          salt: input.salt,
          originalMinterAddress: input.minterAddress,
          destinationAxelarChainIds: input.destinationChainIds,
          deploymentMessageId: result.hash,
          tokenManagerAddress: result.tokenManagerAddress,
          tokenManagerType: result.tokenManagerType as
            | (typeof TOKEN_MANAGER_TYPES)[number]
            | null
            | undefined,
        });
      }

      return result;
    } catch (error) {
      console.error("Stellar deployment failed:", error);
      config.onStatusUpdate?.({
        type: "idle",
      });
      throw error;
    }
  }, [
    input,
    deployerAddress,
    config,
    address,
    kit,
    setRecordDeploymentArgs,
    deployStellarToken,
  ]);

  const deploySui = useCallback(async () => {
    if (!input) {
      throw new Error("Input is not defined");
    }

    const gasValues =
      input?.remoteDeploymentGasFees?.gasFees?.map((x) => x.fee) ?? [];

    const result = await deployToken({
      initialSupply: input.initialSupply as bigint,
      symbol: input.tokenSymbol,
      name: input.tokenName,
      decimals: input.decimals,
      destinationChainIds: input.destinationChainIds,
      minterAddress: input.minterAddress,
      gasValues,
    });

    if (!result?.digest || !result.deploymentMessageId) {
      return;
    }

    const token = result?.events?.[0]?.parsedJson as SuiEventData;

    setRecordDeploymentArgs({
      kind: "interchain",
      deploymentMessageId: result.deploymentMessageId,
      tokenId: token.token_id?.id as string,
      deployerAddress,
      salt: input.salt,
      tokenName: input.tokenName,
      tokenSymbol: input.tokenSymbol,
      tokenDecimals: input.decimals,
      tokenManagerType: result.tokenManagerType,
      axelarChainId: input.sourceChainId,
      originalMinterAddress: result.minterAddress,
      destinationAxelarChainIds: input.destinationChainIds,
      tokenManagerAddress: result.tokenManagerAddress,
      tokenAddress: result.tokenAddress,
    });

    return result;
  }, [input, deployerAddress, setRecordDeploymentArgs, deployToken]);

  const writeAsync = useCallback(async () => {
    await recordDeploymentDraft();

    if (chainId === STELLAR_CHAIN_ID && input) {
      return deployStellar();
    }

    if (chainId === SUI_CHAIN_ID && input) {
      return deploySui();
    }

    if (chainId === HEDERA_CHAIN_ID && input) {
      return deployHedera();
    }

    return deployGenericEVM();
  }, [
    chainId,
    input,
    recordDeploymentDraft,
    deployGenericEVM,
    deployStellar,
    deploySui,
    deployHedera,
  ]);

  return writeAsync;
};

export function useDeployAndRegisterRemoteInterchainTokenMutation(
  config: UseDeployAndRegisterRemoteInterchainTokenConfig,
  input?: UseDeployAndRegisterInterchainTokenInput
) {
  const { address: deployerAddress } = useAccount();
  const chainId = useChainId();
  const { combinedComputed } = useAllChainConfigsQuery();
  const [isReady, setIsReady] = useState(false);

  const { mutateAsync: recordDeploymentAsync } =
    trpc.interchainToken.recordInterchainTokenDeployment.useMutation();

  const onStatusUpdate = throttle(config.onStatusUpdate ?? (() => {}), 150);

  const [recordDeploymentArgs, setRecordDeploymentArgs] =
    useState<RecordInterchainTokenDeploymentInput>();

  const tokenId = useTokenId(input, deployerAddress);

  const { destinationChainIds } = useDestinationChainIds({
    input,
    chainId,
    combinedComputed,
  });

  const { prepareMulticall, setIsTokenReadyForMulticall } = usePrepareMulticall(
    {
      input,
      tokenId,
      destinationChainIds,
      chainId,
    }
  );

  const multicall = useWriteInterchainTokenFactoryMulticall();

  const tokenAddress = useTokenAddress({
    tokenId,
    chainName:
      combinedComputed.indexedById[input?.sourceChainId ?? chainId]?.chain_name,
    chainId,
    multicall,
  });

  const prepareMulticallRequest = prepareMulticall?.request;

  useReady({
    input,
    tokenId,
    tokenAddress,
    deployerAddress,
    prepareMulticallRequest,
    setIsReady,
    chainId,
  });

  useSetEvmDeploymentArgsOnReceipt({
    input,
    tokenId,
    tokenAddress,
    deployerAddress,
    multicall,
    setRecordDeploymentArgs,
  });

  const { recordDeploymentDraft } = useRecordDeployment({
    input,
    tokenId,
    tokenAddress,
    deployerAddress,
    recordDeploymentArgs,
    recordDeploymentAsync,
    onStatusUpdate,
  });

  const writeAsync = useRequestDeployToken({
    input,
    recordDeploymentDraft,
    chainId,
    deployerAddress,
    config,
    setRecordDeploymentArgs,
    prepareMulticallRequest,
    multicall,
    setIsTokenReadyForMulticall,
  });

  return {
    ...multicall,
    writeAsync,
    isReady,
  };
}
