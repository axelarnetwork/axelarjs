import { INTERCHAIN_TOKEN_SERVICE_ABI } from "@axelarjs/evm";
import { toast } from "@axelarjs/ui";
import { throttle } from "@axelarjs/utils";
import { useEffect, useRef, useState } from "react";

import { encodeFunctionData, TransactionExecutionError } from "viem";
import {
  useAccount,
  useMutation,
  useNetwork,
  useWaitForTransaction,
} from "wagmi";

import { watchInterchainTokenServiceEvent } from "~/lib/contracts/InterchainTokenService.actions";
import { useInterchainTokenServiceMulticall } from "~/lib/contracts/InterchainTokenService.hooks";
import { logger } from "~/lib/logger";
import { trpc } from "~/lib/trpc";
import { useEVMChainConfigsQuery } from "~/services/axelarscan/hooks";
import type { IntercahinTokenDetails } from "~/services/kv";
import type { DeployAndRegisterTransactionState } from "../AddErc20.state";

export type UseRegisterCanonicalTokenInput = {
  sourceChainId: string;
  tokenAddress: `0x${string}`;
  tokenName: string;
  tokenSymbol: string;
  decimals: number;
  expectedTokenId: `0x${string}`;
};

const DEFAULT_INPUT: UseRegisterCanonicalTokenInput = {
  sourceChainId: "",
  tokenAddress: "0x",
  expectedTokenId: "0x",
  tokenName: "",
  tokenSymbol: "",
  decimals: -1,
};

export function useRegisterCanonicalTokenMutation(config: {
  value: bigint;
  onStatusUpdate?: (message: DeployAndRegisterTransactionState) => void;
  onFinished?: () => void;
}) {
  const inputRef = useRef<UseRegisterCanonicalTokenInput>(DEFAULT_INPUT);
  const { address: deployerAddress } = useAccount();
  const { chain } = useNetwork();

  const { computed } = useEVMChainConfigsQuery();

  const { writeAsync: multicallAsync, data: multicallResult } =
    useInterchainTokenServiceMulticall();

  const { mutateAsync: recordDeploymentAsync } =
    trpc.interchainToken.recordInterchainTokenDeployment.useMutation();

  const onStatusUpdate = throttle(config.onStatusUpdate ?? (() => {}), 150);

  const [recordDeploymentArgs, setRecordDeploymentArgs] =
    useState<IntercahinTokenDetails | null>(null);

  const unwatch = watchInterchainTokenServiceEvent(
    {
      eventName: "TokenManagerDeployed",
    },
    async (logs) => {
      const log = logs.find(
        ({ args }) =>
          Boolean(args?.tokenId) &&
          args.tokenId === inputRef.current.expectedTokenId
      );
      console.log("all the logs", log);

      if (!log || !chain || !deployerAddress || !log.transactionHash) {
        return;
      }

      unwatch();

      debugger;
      setRecordDeploymentArgs({
        tokenId: inputRef.current.expectedTokenId,
        tokenAddress: inputRef.current.tokenAddress,
        originChainId: chain.id,
        deployerAddress,
        category: "CanonicalToken",
        salt: `0x`,
        deploymentTxHash: log.transactionHash,
        tokenName: inputRef.current.tokenName,
        tokenSymbol: inputRef.current.tokenSymbol,
        tokenDecimals: inputRef.current.decimals,
        originAxelarChainId: inputRef.current.sourceChainId,
        remoteTokens: [],
      });
    }
  );

  useEffect(
    () => {
      if (recordDeploymentArgs) {
        recordDeploymentAsync(recordDeploymentArgs).then(() => {
          onStatusUpdate({
            type: "deployed",
            tokenAddress: recordDeploymentArgs.tokenAddress,
            txHash: recordDeploymentArgs.deploymentTxHash,
          });
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [recordDeploymentArgs]
  );

  useWaitForTransaction({
    hash: multicallResult?.hash,
    confirmations: 8,
    onSuccess() {
      if (!multicallResult) {
        return;
      }
      config.onFinished?.();
    },
  });

  return useMutation(async (input: UseRegisterCanonicalTokenInput) => {
    if (!deployerAddress) {
      return;
    }

    inputRef.current = input;

    onStatusUpdate({
      type: "pending_approval",
    });
    try {
      const deployTxData = encodeFunctionData({
        functionName: "registerCanonicalToken",
        args: [input.tokenAddress],
        abi: INTERCHAIN_TOKEN_SERVICE_ABI,
      });

      const tx = await multicallAsync({
        args: [[deployTxData]],
      });

      if (tx?.hash) {
        onStatusUpdate({
          type: "deploying",
          txHash: tx.hash,
        });
      }
    } catch (error) {
      onStatusUpdate({
        type: "idle",
      });
      if (error instanceof TransactionExecutionError) {
        toast.error(`Transaction failed: ${error.cause.shortMessage}`);

        logger.error(
          "Failed to register canonical interchain token",
          error.cause
        );
      }

      console.error({ error });
    }
  });
}
