import { INTERCHAIN_TOKEN_FACTORY_ENCODERS } from "@axelarjs/evm";
import { invariant, Maybe, throttle } from "@axelarjs/utils";
import { useCallback, useEffect, useMemo, useState } from "react";

import { reduce } from "rambda";
import type { TransactionReceipt } from "viem";
import { useWaitForTransactionReceipt } from "wagmi";

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
import { SUI_CHAIN_ID, useAccount, useChainId } from "~/lib/hooks";
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

  const { destinationChainNames } = useMemo(() => {
    const index = combinedComputed.indexedById;

    const destinationChainNames =
      input?.destinationChainIds.map(
        (destinationChainId) =>
          index[destinationChainId]?.chain_name ?? "Unknown"
      ) ?? [];

    return {
      destinationChainNames,
    };
  }, [combinedComputed.indexedById, input?.destinationChainIds]);

  const multicallArgs = useMemo(() => {
    if (!input || !tokenId || chainId === SUI_CHAIN_ID) {
      return [];
    }

    const deployTxData =
      INTERCHAIN_TOKEN_FACTORY_ENCODERS.registerCanonicalInterchainToken.data({
        tokenAddress: input.tokenAddress as `0x${string}`,
      });

    if (!input.destinationChainIds.length) {
      // early return case, no remote chains
      return [deployTxData];
    }

    const registerTxData = destinationChainNames.map((destinationChain, i) => {
      const gasValue = input.remoteDeploymentGasFees[i] ?? 0n;

      const args = {
        originalTokenAddress: input.tokenAddress as `0x{string}`,
        destinationChain,
        gasValue,
      };

      return INTERCHAIN_TOKEN_FACTORY_ENCODERS.deployRemoteCanonicalInterchainToken.data(
        args
      );
    });

    return [deployTxData, ...registerTxData];
  }, [input, tokenId, destinationChainNames, chainId]);

  const totalGasFee = Maybe.of(input?.remoteDeploymentGasFees).mapOr(
    0n,
    reduce((a, b) => a + b, 0n)
  );

  const isMutationReady =
    multicallArgs.length > 0 &&
    // enable if there are no remote chains or if there are remote chains and the total gas fee is greater than 0
    (!destinationChainNames.length || totalGasFee > 0n);

  const { data } = useSimulateInterchainTokenFactoryMulticall({
    chainId,
    value: totalGasFee,
    args: [multicallArgs],
    query: {
      enabled: isMutationReady,
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

    if (chainId === SUI_CHAIN_ID && input) {
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
    } else {
      invariant(
        data?.request !== undefined,
        "useDeployAndRegisterRemoteCanonicalTokenMutation: prepareMulticall?.request is not defined"
      );
      return await multicall.writeContractAsync(data.request);
    }
  }, [
    data,
    multicall,
    recordDeploymentDraft,
    chainId,
    deployerAddress,
    input,
    registerCanonicalToken,
  ]);

  const write = useCallback(() => {
    if (!multicall.writeContract || !data) {
      throw new Error(
        "useDeployAndRegisterRemoteCanonicalTokenMutation: multicall.write is not defined"
      );
    }

    recordDeploymentDraft()
      .then(() => data && multicall.writeContract(data.request))
      .catch((e) => {
        console.error(
          "useDeployAndRegisterRemoteCanonicalTokenMutation: unable to record tx",
          e
        );
        onStatusUpdate({
          type: "idle",
        });
      });
  }, [data, multicall, onStatusUpdate, recordDeploymentDraft]);

  return { ...multicall, writeAsync, write };
}
