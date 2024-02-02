import { INTERCHAIN_TOKEN_FACTORY_ENCODERS } from "@axelarjs/evm";
import { Maybe, throttle } from "@axelarjs/utils";
import { useCallback, useEffect, useMemo, useState } from "react";

import { reduce } from "rambda";
import { useAccount, useChainId, useWaitForTransaction } from "wagmi";

import {
  useInterchainTokenFactoryCanonicalInterchainTokenId,
  useInterchainTokenFactoryMulticall,
  usePrepareInterchainTokenFactoryMulticall,
} from "~/lib/contracts/InterchainTokenFactory.hooks";
import {
  decodeDeploymentMessageId,
  type DeploymentMessageId,
} from "~/lib/drizzle/schema";
import { trpc } from "~/lib/trpc";
import { isValidEVMAddress } from "~/lib/utils/validation";
import { RecordInterchainTokenDeploymentInput } from "~/server/routers/interchainToken/recordInterchainTokenDeployment";
import { useEVMChainConfigsQuery } from "~/services/axelarscan/hooks";
import type { DeployAndRegisterTransactionState } from "../CanonicalTokenDeployment.state";

export interface UseDeployAndRegisterCanonicalTokenInput {
  sourceChainId: string;
  tokenName: string;
  tokenSymbol: string;
  tokenAddress: `0x${string}`;
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

  const { computed } = useEVMChainConfigsQuery();

  const { mutateAsync: recordDeploymentAsync } =
    trpc.interchainToken.recordInterchainTokenDeployment.useMutation();

  const onStatusUpdate = throttle(config.onStatusUpdate ?? (() => {}), 150);

  const [recordDeploymentArgs, setRecordDeploymentArgs] =
    useState<RecordInterchainTokenDeploymentInput>();

  const { data: tokenId } = useInterchainTokenFactoryCanonicalInterchainTokenId(
    {
      args: INTERCHAIN_TOKEN_FACTORY_ENCODERS.canonicalInterchainTokenId.args({
        tokenAddress: input?.tokenAddress as `0x${string}`,
      }),
      enabled: input?.tokenAddress && isValidEVMAddress(input?.tokenAddress),
    }
  );

  const { originalChainName, destinationChainNames } = useMemo(() => {
    const index = computed.indexedById;
    const originalChainName =
      index[input?.sourceChainId ?? chainId]?.chain_name ?? "Unknown";

    const destinationChainNames =
      input?.destinationChainIds.map(
        (destinationChainId) =>
          index[destinationChainId]?.chain_name ?? "Unknown"
      ) ?? [];

    return {
      originalChainName,
      destinationChainNames,
    };
  }, [
    chainId,
    computed.indexedById,
    input?.destinationChainIds,
    input?.sourceChainId,
  ]);

  const multicallArgs = useMemo(() => {
    if (!input || !tokenId) {
      return [];
    }

    const deployTxData =
      INTERCHAIN_TOKEN_FACTORY_ENCODERS.registerCanonicalInterchainToken.data({
        tokenAddress: input.tokenAddress,
      });

    if (!input.destinationChainIds.length) {
      // early return case, no remote chains
      return [deployTxData];
    }

    const registerTxData = destinationChainNames.map((destinationChain, i) => {
      const gasValue = input.remoteDeploymentGasFees[i] ?? 0n;

      const args = {
        originalChain: originalChainName,
        originalTokenAddress: input.tokenAddress,
        destinationChain,
        gasValue,
      };

      return INTERCHAIN_TOKEN_FACTORY_ENCODERS.deployRemoteCanonicalInterchainToken.data(
        args
      );
    });

    return [deployTxData, ...registerTxData];
  }, [input, tokenId, destinationChainNames, originalChainName]);

  const totalGasFee = Maybe.of(input?.remoteDeploymentGasFees).mapOr(
    0n,
    reduce((a, b) => a + b, 0n)
  );

  const isMutationReady =
    multicallArgs.length > 0 &&
    // enable if there are no remote chains or if there are remote chains and the total gas fee is greater than 0
    (!destinationChainNames.length || totalGasFee > 0n);

  const prepareMulticall = usePrepareInterchainTokenFactoryMulticall({
    chainId,
    value: totalGasFee,
    args: [multicallArgs],
    enabled: isMutationReady,
  });

  const multicall = useInterchainTokenFactoryMulticall(prepareMulticall.config);

  useWaitForTransaction({
    hash: multicall?.data?.hash,
    onSuccess: ({ transactionHash: txHash, transactionIndex: txIndex }) => {
      if (!txHash || !tokenId || !deployerAddress || !input) {
        console.error(
          "useDeployAndRegisterRemoteCanonicalTokenMutation: unable to setRecordDeploymentArgs",
          { txHash, tokenId, deployerAddress, input }
        );
        return;
      }

      setRecordDeploymentArgs({
        kind: "canonical",
        deploymentMessageId: `${txHash}-${txIndex}`,
        tokenId,
        tokenAddress: input.tokenAddress,
        deployerAddress,
        tokenName: input.tokenName,
        tokenSymbol: input.tokenSymbol,
        tokenDecimals: input.decimals,
        axelarChainId: input.sourceChainId,
        destinationAxelarChainIds: input.destinationChainIds,
      });
    },
  });

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
      destinationAxelarChainIds: input.destinationChainIds,
      deploymentMessageId: "",
    });
  }, [deployerAddress, input, recordDeploymentAsync, tokenId]);

  const writeAsync = useCallback(async () => {
    if (!multicall.writeAsync) {
      throw new Error(
        "useDeployAndRegisterRemoteCanonicalTokenMutation: multicall.writeAsync is not defined"
      );
    }

    await recordDeploymentDraft();

    return await multicall.writeAsync();
  }, [multicall, recordDeploymentDraft]);

  const write = useCallback(() => {
    if (!multicall.write) {
      throw new Error(
        "useDeployAndRegisterRemoteCanonicalTokenMutation: multicall.write is not defined"
      );
    }

    recordDeploymentDraft()
      .then(multicall.write)
      .catch((e) => {
        console.error(
          "useDeployAndRegisterRemoteCanonicalTokenMutation: unable to record tx",
          e
        );
        onStatusUpdate({
          type: "idle",
        });
      });
  }, [multicall, onStatusUpdate, recordDeploymentDraft]);

  return { ...multicall, writeAsync, write };
}
