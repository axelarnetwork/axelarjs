import {
  INTERCHAIN_TOKEN_FACTORY_ENCODERS,
  INTERCHAIN_TOKEN_SERVICE_ENCODERS,
} from "@axelarjs/evm";
import { invariant, throttle } from "@axelarjs/utils";
import { useCallback, useEffect, useMemo, useState } from "react";

import { zeroAddress, type TransactionReceipt } from "viem";
import { useWaitForTransactionReceipt } from "wagmi";

import { useDeployStellarToken } from "~/features/stellarHooks/useDeployStellarToken";
import useDeployToken from "~/features/suiHooks/useDeployToken";
import { useReadHederaExchangeRatePrecompileTinycentsToTinybars } from "~/lib/contracts/hedera/HederaExchangeRatePrecompile.hooks";
import {
  useReadInterchainTokenServiceRegisteredTokenAddress,
  useReadInterchainTokenServiceWhbarAddress,
} from "~/lib/contracts/hedera/HederaInterchainTokenService.hooks";
import {
  useReadWhbarAllowance,
  useReadWhbarBalanceOf,
  useWriteWhbarApprove,
  useWriteWhbarDeposit,
} from "~/lib/contracts/hedera/WHBAR.hooks";
import {
  interchainTokenFactoryAddress,
  useReadInterchainTokenFactoryInterchainTokenId,
  useSimulateInterchainTokenFactoryMulticall,
  useWriteInterchainTokenFactoryMulticall,
} from "~/lib/contracts/InterchainTokenFactory.hooks";
import { useReadInterchainTokenServiceInterchainTokenAddress } from "~/lib/contracts/InterchainTokenService.hooks";
import {
  decodeDeploymentMessageId,
  type DeploymentMessageId,
} from "~/lib/drizzle/schema";
import {
  HEDERA_CHAIN_ID,
  STELLAR_CHAIN_ID,
  SUI_CHAIN_ID,
  useAccount,
  useChainId,
} from "~/lib/hooks";
import { useStellarKit } from "~/lib/providers/StellarWalletKitProvider";
import { trpc } from "~/lib/trpc";
import { isValidEVMAddress } from "~/lib/utils/validation";
import type { EstimateGasFeeMultipleChainsOutput } from "~/server/routers/axelarjsSDK";
import { RecordInterchainTokenDeploymentInput } from "~/server/routers/interchainToken/recordInterchainTokenDeployment";
import { useAllChainConfigsQuery } from "~/services/axelarConfigs/hooks";
import { useReadInterchainTokenServiceTokenCreationPrice } from "../../../lib/contracts/hedera/HederaInterchainTokenService.hooks";
import { TOKEN_MANAGER_TYPES } from "../../../lib/drizzle/schema/common";
import type { DeployAndRegisterTransactionState } from "../InterchainTokenDeployment.state";

// In an effort to keep the codebase without hardcoded chains, we create lists of chains up here
/** a token address is not needed in advance if the chain name includes the following strings */
const CHAINS_WITHOUT_TOKEN_ADDRESS = ["sui", "stellar", "hedera"];
/** the registered contract is used */
const CHAIN_IDS_WITH_REGISTERED_TOKEN_ADDRESS = [HEDERA_CHAIN_ID];
/** chains that don't have their deployment draft recorded - check if chain name includes any of these strings */
const CHAIN_IDS_SKIP_DEPLOYMENT_DRAFT_RECORDING = ["sui", "stellar"];
/** a multicall is not needed for these chains */
const CHAIN_IDS_WITHOUT_MULTICALL = [SUI_CHAIN_ID];

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
 *    └── useTokenAddress() ──────────► Get token address from token ID
 *    └── useDestinationChainIds() ───► Map destination chains to IDs
 *
 * 2. MULTICALL PREPARATION
 *    └── useMulticallArgs() ─────────► Build encoded function calls
 *    └── useSimulateContract() ──────► Prepare transaction simulation
 *
 * 3. READINESS CHECK
 *    └── useReady() ─────────────────► Check if deployment is ready
 *
 * 4. DRAFT DEPLOYMENT RECORDING
 *    └── recordDeploymentDraft() ────► Record deployment draft in DB
 *
 * 5. DEPLOYMENT EXECUTION
 *    ├── Stellar: deployStellar() ────► Deploy on Stellar network
 *    ├── Sui: deploySui() ────────────► Deploy on Sui network
 *    └── EVM: multicall.writeContractAsync() ──► Deploy via multicall
 *
 * 6. TRANSACTION MONITORING
 *    └── useReceipt() ────────────────► Wait for transaction receipt
 *
 * 7. FINAL DEPLOYMENT RECORDING
 *    └── useRecordDeployment() ───────► Record final deployment in database
 *
 * 8. STATUS UPDATES
 *    └── onStatusUpdate() ────────────► Update UI with progress
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

const useMulticallArgs = ({
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
        gasValue: input.remoteDeploymentGasFees?.gasFees?.[i].fee ?? 0n,
      })
    );

    return [deployTxData, ...registerTxData];
  }, [input, tokenId, destinationChainIds, chainId]);

  return multicallArgs;
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

  console.log({
    tokenId,
    chainName,
    chainId,
    isWithTokenAddress,
    isWithRegisteredTokenAddress,
    tokenAddress,
    registeredTokenAddress,
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
    if (isValidEVMAddress(deployerAddress) && !prepareMulticallRequest) {
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

  const setRecordDeploymentArgsOnReceipt = useCallback(() => {
    const { transactionHash: txHash, transactionIndex: txIndex } =
      receipt as TransactionReceipt;

    if (!txHash || !tokenAddress || !tokenId || !deployerAddress || !input) {
      console.error(
        "useDeployAndRegisterRemoteInterchainTokenMutation: unable to setRecordDeploymentArgs",
        {
          txHash,
          tokenAddress,
          tokenId,
          deployerAddress,
          input,
        }
      );
      return;
    }

    setRecordDeploymentArgs({
      kind: "interchain",
      deploymentMessageId: `${txHash}-${txIndex}`,
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
    deployerAddress,
    input,
    tokenAddress,
    tokenId,
    setRecordDeploymentArgs,
    receipt,
  ]);

  useEffect(
    () => {
      if (receipt) {
        setRecordDeploymentArgsOnReceipt();
      }
    },
    // TODO find a better way which doesn't require tokenAddress in the deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [receipt, tokenAddress]
  );
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
}: UseRequestDeployTokenParams) => {
  const { address } = useAccount();
  const { kit } = useStellarKit();

  const { deployToken } = useDeployToken();

  const { deployStellarToken } = useDeployStellarToken();

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

  // Hedera-specific logic
  const { prepareHederaDeployment } = useHedera({ chainId });

  const writeAsync = useCallback(async () => {
    await recordDeploymentDraft();

    if (chainId === STELLAR_CHAIN_ID && input) {
      return deployStellar();
    }

    if (chainId === SUI_CHAIN_ID && input) {
      return deploySui();
    }

    // Handle EVM deployment
    invariant(
      prepareMulticallRequest !== undefined,
      "useDeployAndRegisterRemoteInterchainTokenMutation: prepareMulticall?.request is not defined"
    );

    if (chainId === HEDERA_CHAIN_ID && input) {
      // TODO: remove hardcode
      prepareMulticallRequest.gas = 900000n;
      await prepareHederaDeployment();
    }

    return multicall.writeContractAsync(prepareMulticallRequest);
  }, [
    chainId,
    input,
    multicall,
    prepareMulticallRequest,
    recordDeploymentDraft,
    deployStellar,
    deploySui,
    prepareHederaDeployment,
  ]);

  return writeAsync;
};

interface UseHederaParams {
  chainId: number;
}

const useHedera = ({ chainId }: UseHederaParams) => {
  const { address } = useAccount();

  // Get token creation price
  const { data: tokenCreationPriceTinycents } =
    useReadInterchainTokenServiceTokenCreationPrice({
      query: {
        enabled: chainId === HEDERA_CHAIN_ID,
      },
    });

  // Convert token creation price from tinycents to tinybars
  const { data: tokenCreationPriceTinybars } =
    useReadHederaExchangeRatePrecompileTinycentsToTinybars({
      chainId: HEDERA_CHAIN_ID,
      args: tokenCreationPriceTinycents
        ? [tokenCreationPriceTinycents]
        : undefined,
      query: {
        enabled: !!tokenCreationPriceTinycents && chainId === HEDERA_CHAIN_ID,
      },
    });

  // Get WHBAR address
  const { data: whbarAddress } = useReadInterchainTokenServiceWhbarAddress({
    chainId: HEDERA_CHAIN_ID,
    query: {
      enabled: chainId === HEDERA_CHAIN_ID,
    },
  });

  // Get WHBAR balance
  const { data: whbarBalance } = useReadWhbarBalanceOf({
    address: whbarAddress,
    chainId: HEDERA_CHAIN_ID,
    args: address ? [address] : undefined,
    query: {
      enabled: chainId === HEDERA_CHAIN_ID && !!address && !!whbarAddress,
    },
  });

  // Get WHBAR allowance
  const { data: whbarAllowance } = useReadWhbarAllowance({
    address: whbarAddress,
    chainId: HEDERA_CHAIN_ID,
    args: address ? [address, interchainTokenFactoryAddress] : undefined,
    query: {
      enabled: chainId === HEDERA_CHAIN_ID && !!address && !!whbarAddress,
    },
  });

  // WHBAR hooks
  const whbarDeposit = useWriteWhbarDeposit();
  const { writeContractAsync: approveAsync } = useWriteWhbarApprove();

  // WHBAR deposit function - deposits HBAR to get WHBAR
  const depositWhbarHedera = useCallback(async () => {
    if (
      chainId !== HEDERA_CHAIN_ID ||
      !whbarAddress ||
      !whbarBalance ||
      !tokenCreationPriceTinybars
    ) {
      return;
    }

    const currentWhbarTinybars = whbarBalance;
    const targetWhbarTinybars = tokenCreationPriceTinybars;
    const depositWhbar =
      currentWhbarTinybars < targetWhbarTinybars
        ? targetWhbarTinybars - currentWhbarTinybars
        : 0n; // Only deposit if needed

    console.log("💰 WHBAR Balance Calculation:", {
      targetWhbarTinybars,
      depositWhbar,
      whbarBalance,
    });

    // Only proceed with deposit if we need to deposit
    if (depositWhbar > 0n) {
      console.log("🚀 Executing WHBAR deposit");
      await whbarDeposit.writeContractAsync({
        address: whbarAddress,
        value: depositWhbar,
      });
      console.log("✅ WHBAR deposit completed");
    } else {
      console.log("✅ WHBAR balance is sufficient skipping deposit");
    }
  }, [
    chainId,
    whbarAddress,
    whbarDeposit,
    whbarBalance,
    tokenCreationPriceTinybars,
  ]);

  // WHBAR approval function - approves WHBAR for token creation
  const approveWhbarHedera = useCallback(async () => {
    if (
      chainId !== HEDERA_CHAIN_ID ||
      !whbarAddress ||
      !tokenCreationPriceTinybars
    )
      return;

    const approvalAmount = tokenCreationPriceTinybars;

    // Check if approval is needed
    const needsWhbarApproval =
      whbarAllowance && approvalAmount && whbarAllowance < approvalAmount;

    console.log("🚀 Approving WHBAR for token creation:", {
      approvalAmount,
      needsWhbarApproval,
    });

    if (needsWhbarApproval && approvalAmount > 0n) {
      await approveAsync({
        address: whbarAddress,
        args: [interchainTokenFactoryAddress, approvalAmount],
      });
      console.log("✅ WHBAR approval completed");
    } else if (!needsWhbarApproval) {
      console.log("✅ WHBAR already approved, skipping approval");
    }
  }, [
    chainId,
    whbarAddress,
    tokenCreationPriceTinybars,
    whbarAllowance,
    approveAsync,
  ]);

  const prepareHederaDeployment = useCallback(async () => {
    if (chainId !== HEDERA_CHAIN_ID) return;

    await depositWhbarHedera();
    await approveWhbarHedera();
  }, [chainId, depositWhbarHedera, approveWhbarHedera]);

  return {
    prepareHederaDeployment,
  };
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

  const multicallArgs = useMulticallArgs({
    input,
    tokenId,
    destinationChainIds,
    chainId,
  });

  const totalGasFee = input?.remoteDeploymentGasFees?.totalGasFee ?? 0n;

  // enable if there are no remote chains or if there are remote chains and the total gas fee is greater than 0
  const isDestinationFeeSet = !destinationChainIds.length || totalGasFee > 0n;
  const isMutationReady = multicallArgs.length > 0 && isDestinationFeeSet;

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
  });

  return {
    ...multicall,
    writeAsync,
    isReady,
  };
}
