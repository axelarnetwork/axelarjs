import { INTERCHAIN_TOKEN_FACTORY_ENCODERS } from "@axelarjs/evm";
import { invariant, Maybe, throttle } from "@axelarjs/utils";
import { useCallback, useEffect, useMemo, useState } from "react";

import { reduce } from "rambda";
import type { TransactionReceipt } from "viem";
import { useWaitForTransactionReceipt } from "wagmi";

import {
  HEDERA_CHAIN_ID,
  STELLAR_CHAIN_ID,
  SUI_CHAIN_ID,
} from "~/config/chains";
import { useRegisterStellarTokenWithContractDeployment } from "~/features/stellarHooks";
import useRegisterCanonicalToken from "~/features/suiHooks/useRegisterCanonicalToken";
import {
  useReadInterchainTokenFactoryCanonicalInterchainTokenId,
  useSimulateInterchainTokenFactoryMulticall,
  useWriteInterchainTokenFactoryMulticall,
} from "~/lib/contracts/InterchainTokenFactory.hooks";
import {
  decodeDeploymentMessageId,
  type DeploymentMessageId,
} from "~/lib/drizzle/schema";
import { useAccount, useChainId } from "~/lib/hooks";
import { useStellarKit } from "~/lib/providers/StellarWalletKitProvider";
import { trpc } from "~/lib/trpc";
import { isValidEVMAddress } from "~/lib/utils/validation";
import { RecordInterchainTokenDeploymentInput } from "~/server/routers/interchainToken/recordInterchainTokenDeployment";
import { useAllChainConfigsQuery } from "~/services/axelarConfigs/hooks";
import type { DeployAndRegisterTransactionState } from "../CanonicalTokenDeployment.state";

export interface UseDeployAndRegisterCanonicalTokenInput {
  sourceChainId: string;
  tokenName: string;
  tokenSymbol: string;
  tokenAddress: string;
  decimals: number;
  destinationChainIds: string[];
  remoteDeploymentGasFees: bigint[];
}

export interface UseDeployAndRegisterRemoteCanonicalTokenConfig {
  onStatusUpdate?: (message: DeployAndRegisterTransactionState) => void;
  onFinished?: () => void;
}

export function useDeployAndRegisterRemoteCanonicalTokenMutation(
  config: UseDeployAndRegisterRemoteCanonicalTokenConfig,
  input?: UseDeployAndRegisterCanonicalTokenInput
) {
  const { address: deployerAddress } = useAccount();
  const chainId = useChainId();

  const { combinedComputed } = useAllChainConfigsQuery();
  const { registerCanonicalToken } = useRegisterCanonicalToken();
  const { registerTokenWithContractDeployment } =
    useRegisterStellarTokenWithContractDeployment();
  const { kit } = useStellarKit();

  const { mutateAsync: recordDeploymentAsync } =
    trpc.interchainToken.recordInterchainTokenDeployment.useMutation();

  const onStatusUpdate = throttle(config.onStatusUpdate ?? (() => {}), 150);

  const [recordDeploymentArgs, setRecordDeploymentArgs] =
    useState<RecordInterchainTokenDeploymentInput>();

  const { data: tokenId } =
    useReadInterchainTokenFactoryCanonicalInterchainTokenId({
      args: INTERCHAIN_TOKEN_FACTORY_ENCODERS.canonicalInterchainTokenId.args({
        tokenAddress: input?.tokenAddress as `0x${string}`,
      }),
      query: {
        enabled: Maybe.of(input?.tokenAddress).mapOr(false, isValidEVMAddress),
      },
    });

  const destinationChainNames = useMemo(() => {
    if (!input) return [] as string[];
    const index = combinedComputed.indexedById;
    return input.destinationChainIds.map(
      (destinationChainId) => index[destinationChainId]?.chain_name ?? "Unknown"
    );
  }, [combinedComputed.indexedById, input]);

  const multicallArgs = useMemo(() => {
    if (!input) return [] as `0x${string}`[];
    if (!isValidEVMAddress(input.tokenAddress)) return [] as `0x${string}`[];

    const deployTxData =
      INTERCHAIN_TOKEN_FACTORY_ENCODERS.registerCanonicalInterchainToken.data({
        tokenAddress: input.tokenAddress,
      });

    if (input.destinationChainIds.length === 0) return [deployTxData];

    const hasGasFees = Array.isArray(input.remoteDeploymentGasFees);
    if (!hasGasFees)
      throw new Error("Gas fees not provided for remote deployment");

    const lengthMatches =
      input.remoteDeploymentGasFees.length === input.destinationChainIds.length;
    if (!lengthMatches) {
      throw new Error(
        "remoteDeploymentGasFees length does not match destinationChainIds"
      );
    }

    const registerTxData = destinationChainNames.map((destinationChain, i) => {
      const gasValue = input.remoteDeploymentGasFees[i];

      const args = {
        originalTokenAddress: input.tokenAddress as `0x${string}`,
        destinationChain,
        gasValue,
      };

      return INTERCHAIN_TOKEN_FACTORY_ENCODERS.deployRemoteCanonicalInterchainToken.data(
        args
      );
    });

    return [deployTxData, ...registerTxData];
  }, [input, destinationChainNames]);

  const totalGasFee = Maybe.of(input?.remoteDeploymentGasFees).mapOr(
    0n,
    reduce((a, b) => a + b, 0n)
  );

  const { data, error: simulationError } =
    useSimulateInterchainTokenFactoryMulticall({
      chainId,
      value: totalGasFee,
      args: [multicallArgs],
      query: {
        enabled:
          multicallArgs.length > 0 &&
          chainId !== SUI_CHAIN_ID &&
          chainId !== STELLAR_CHAIN_ID &&
          chainId !== HEDERA_CHAIN_ID,
      },
    });

  const multicall = useWriteInterchainTokenFactoryMulticall();

  const { data: receipt } = useWaitForTransactionReceipt({
    hash: multicall?.data,
  });

  const onReceipt = useCallback(
    (receipt: TransactionReceipt) => {
      const { transactionHash, transactionIndex } = receipt;

      if (!transactionHash || !tokenId || !deployerAddress || !input) {
        console.error(
          "useDeployAndRegisterRemoteCanonicalTokenMutation: unable to setRecordDeploymentArgs",
          { transactionHash, tokenId, deployerAddress, input }
        );
        return;
      }

      setRecordDeploymentArgs({
        kind: "canonical",
        deploymentMessageId: `${transactionHash}-${transactionIndex}`,
        tokenId,
        tokenAddress: input.tokenAddress,
        deployerAddress,
        tokenName: input.tokenName,
        tokenSymbol: input.tokenSymbol,
        tokenDecimals: input.decimals,
        axelarChainId: input.sourceChainId,
        tokenManagerAddress: "",
        destinationAxelarChainIds: input.destinationChainIds,
      });
    },
    [deployerAddress, input, tokenId]
  );

  useEffect(
    () => {
      if (!receipt) return;
      onReceipt(receipt);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [receipt]
  );

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
            txHash: tx.hash as `0x${string}`,
          });
        })
        .catch((e) => {
          console.error(
            "useDeployAndRegisterRemoteCanonicalTokenMutation: unable to record tx",
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
    if (!input || !tokenId || !deployerAddress) {
      return;
    }

    return await recordDeploymentAsync({
      kind: "canonical",
      tokenId,
      deployerAddress,
      tokenName: input.tokenName,
      tokenSymbol: input.tokenSymbol,
      tokenDecimals: input.decimals,
      axelarChainId: input.sourceChainId,
      tokenAddress: input.tokenAddress,
      tokenManagerAddress: "",
      destinationAxelarChainIds: input.destinationChainIds,
      deploymentMessageId: "",
    });
  }, [deployerAddress, input, recordDeploymentAsync, tokenId]);

  const writeAsync = useCallback(async () => {
    await recordDeploymentDraft();
    // If input is missing, fall back to default EVM flow with prepared request
    if (!input) {
      invariant(
        data?.request !== undefined,
        `useDeployAndRegisterRemoteCanonicalTokenMutation: prepared request is undefined (chainId: ${chainId})`
      );
      return await multicall.writeContractAsync(data.request);
    }

    switch (chainId) {
      case SUI_CHAIN_ID: {
        const gasValues = input.remoteDeploymentGasFees;
        const result = await registerCanonicalToken({
          destinationChains: input.destinationChainIds,
          coinType: input.tokenAddress,
          gasValues,
        });
        if (result?.digest && result.deploymentMessageId) {
          const token: any = result?.events?.[0]?.parsedJson;
          setRecordDeploymentArgs({
            kind: "canonical",
            deploymentMessageId: result.deploymentMessageId,
            tokenId: token.token_id?.id,
            deployerAddress,
            tokenName: input.tokenName,
            tokenSymbol: input.tokenSymbol,
            tokenDecimals: input.decimals,
            tokenManagerType: result.tokenManagerType,
            axelarChainId: input.sourceChainId,
            destinationAxelarChainIds: input.destinationChainIds,
            tokenManagerAddress: result.tokenManagerAddress,
            tokenAddress: input.tokenAddress,
          });
          return result;
        }
        break;
      }
      case STELLAR_CHAIN_ID: {
        if (!kit) {
          throw new Error("Stellar wallet not connected");
        }
        const result = await registerTokenWithContractDeployment({
          kit,
          tokenAddress: input.tokenAddress,
          destinationChains: input.destinationChainIds,
          gasValues: input.remoteDeploymentGasFees,
          onStatusUpdate: (status) => {
            if (config.onStatusUpdate) {
              config.onStatusUpdate(status);
            }
          },
        });

        if (result?.tokenRegistration?.hash) {
          setRecordDeploymentArgs({
            kind: "canonical",
            deploymentMessageId:
              result?.tokenRegistration?.deploymentMessageId ||
              result?.tokenRegistration?.hash,
            tokenId: result.tokenRegistration.tokenId,
            deployerAddress,
            tokenName: input.tokenName,
            tokenSymbol: input.tokenSymbol,
            tokenDecimals: input.decimals,
            tokenManagerType: result.tokenRegistration.tokenManagerType,
            axelarChainId: input.sourceChainId,
            destinationAxelarChainIds: input.destinationChainIds,
            tokenAddress: result.tokenRegistration.tokenAddress,
            tokenManagerAddress: result.tokenRegistration.tokenManagerAddress,
          });
          return result.tokenRegistration;
        }
        break;
      }
      case HEDERA_CHAIN_ID: {
        // Hedera: skip prepare/simulation but still submit the transaction
        if (!multicallArgs.length) {
          throw new Error(
            "No calls prepared for multicall; cannot submit transaction on Hedera"
          );
        }
        return await multicall.writeContractAsync({
          args: [multicallArgs],
          value: totalGasFee,
        } as any);
      }
      default: {
        invariant(
          data?.request !== undefined,
          `useDeployAndRegisterRemoteCanonicalTokenMutation: prepared request is undefined (chainId: ${chainId})`
        );
        return await multicall.writeContractAsync(data.request);
      }
    }
  }, [
    data,
    multicall,
    recordDeploymentDraft,
    chainId,
    deployerAddress,
    input,
    registerCanonicalToken,
    registerTokenWithContractDeployment,
    kit,
    config,
    multicallArgs,
    totalGasFee,
  ]);

  const write = useCallback(() => {
    if (!multicall.writeContract || !data?.request) {
      throw new Error(
        "useDeployAndRegisterRemoteCanonicalTokenMutation: write or prepared request is undefined"
      );
    }

    recordDeploymentDraft()
      .then(() => multicall.writeContract(data.request))
      .catch((e) => {
        console.error(
          "useDeployAndRegisterRemoteCanonicalTokenMutation: failed during record or write",
          e
        );
        onStatusUpdate({
          type: "idle",
        });
      });
  }, [data, multicall, onStatusUpdate, recordDeploymentDraft]);

  return {
    ...multicall,
    writeAsync,
    write,
    simulationError,
  } as any;
}
