import { INTERCHAIN_TOKEN_SERVICE_ABI } from "@axelarjs/evm";
import { toast } from "@axelarjs/ui";
import { hexlify, throttle } from "@axelarjs/utils";
import { useEffect, useMemo, useRef, useState } from "react";

import { encodeFunctionData, TransactionExecutionError } from "viem";
import {
  useAccount,
  useMutation,
  useNetwork,
  useWaitForTransaction,
} from "wagmi";

import { watchInterchainTokenServiceEvent } from "~/lib/contracts/InterchainTokenService.actions";
import {
  useInterchainTokenServiceGetCustomTokenId,
  useInterchainTokenServiceGetStandardizedTokenAddress,
  useInterchainTokenServiceMulticall,
} from "~/lib/contracts/InterchainTokenService.hooks";
import { logger } from "~/lib/logger";
import { trpc } from "~/lib/trpc";
import { isValidEVMAddress } from "~/lib/utils/validation";
import { useEVMChainConfigsQuery } from "~/services/axelarscan/hooks";
import type { IntercahinTokenDetails } from "~/services/kv";
import type { DeployAndRegisterTransactionState } from "../AddErc20.state";

export type UseDeployAndRegisterInterchainTokenInput = {
  sourceChainId: string;
  tokenName: string;
  tokenSymbol: string;
  decimals: number;
  destinationChainIds: string[];
  gasFees: bigint[];
  cap?: bigint;
  mintTo?: `0x${string}`;
};

const DEFAULT_INPUT: UseDeployAndRegisterInterchainTokenInput = {
  sourceChainId: "",
  tokenName: "",
  tokenSymbol: "",
  decimals: 0,
  destinationChainIds: [],
  gasFees: [],
  cap: BigInt(0),
  mintTo: `0x000`,
};

export function useDeployInterchainTokenMutation(config: {
  value: bigint;
  onStatusUpdate?: (message: DeployAndRegisterTransactionState) => void;
  onFinished?: () => void;
}) {
  const inputRef =
    useRef<UseDeployAndRegisterInterchainTokenInput>(DEFAULT_INPUT);
  const { address: deployerAddress } = useAccount();
  const { chain } = useNetwork();

  const salt = useMemo(
    () =>
      "crypto" in window
        ? (hexlify(crypto.getRandomValues(new Uint8Array(32))) as `0x${string}`)
        : (hexlify(Math.random() * 2 ** 256) as `0x${string}`),
    []
  );

  const { data: tokenId } = useInterchainTokenServiceGetCustomTokenId({
    args: [deployerAddress as `0x${string}`, salt],
    enabled: deployerAddress && isValidEVMAddress(deployerAddress),
  });

  const { data: tokenAddress } =
    useInterchainTokenServiceGetStandardizedTokenAddress({
      args: [tokenId as `0x${string}`],
      enabled: Boolean(tokenId),
    });

  const { data: evmChainConfigs } = useEVMChainConfigsQuery();

  const { writeAsync: multicallAsync, data: multicallResult } =
    useInterchainTokenServiceMulticall();

  const { mutateAsync: recordDeploymentAsync } =
    trpc.interchainToken.recordInterchainTokenDeployment.useMutation();

  const onStatusUpdate = throttle(config.onStatusUpdate ?? (() => {}), 150);

  const [recordDeploymentArgs, setDeploymentArgs] =
    useState<IntercahinTokenDetails | null>(null);

  const unwatch = watchInterchainTokenServiceEvent(
    {
      eventName: "StandardizedTokenDeployed",
    },
    async (logs) => {
      const log = logs.find(
        ({ args }) =>
          Boolean(args?.tokenId) &&
          args.decimals === inputRef.current.decimals &&
          args.name === inputRef.current.tokenName &&
          args.symbol === inputRef.current.tokenSymbol &&
          args.mintTo === deployerAddress
      );

      if (
        !log ||
        !chain ||
        !deployerAddress ||
        !log.transactionHash ||
        !tokenAddress ||
        !tokenId
      ) {
        return;
      }

      unwatch();

      setDeploymentArgs({
        tokenId: tokenId,
        tokenAddress: tokenAddress,
        originChainId: chain.id,
        deployerAddress,
        salt,
        deploymentTxHash: log.transactionHash,
        tokenName: inputRef.current.tokenName,
        tokenSymbol: inputRef.current.tokenSymbol,
        tokenDecimals: inputRef.current.decimals,
        originAxelarChainId: inputRef.current.sourceChainId,
        remoteTokens: inputRef.current.destinationChainIds.map(
          (axelarChainId) => ({
            axelarChainId,
            chainId:
              evmChainConfigs?.find((c) => c.id === axelarChainId.toLowerCase())
                ?.chain_id ?? 0,
            address: tokenAddress,
            status: "pending",
            deplymentTxHash: log.transactionHash as `0x${string}`,
            // deploymentLogIndex is unknown at this point
          })
        ),
      });
    }
  );

  useEffect(() => {
    if (recordDeploymentArgs) {
      recordDeploymentAsync(recordDeploymentArgs).then(() => {
        onStatusUpdate({
          type: "deployed",
          tokenAddress: recordDeploymentArgs.tokenAddress,
          txHash: recordDeploymentArgs.deploymentTxHash,
        });
      });
    }
  }, [recordDeploymentArgs]);

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

  return useMutation(
    async (input: UseDeployAndRegisterInterchainTokenInput) => {
      if (!deployerAddress) {
        return;
      }

      inputRef.current = input;

      onStatusUpdate({
        type: "pending_approval",
      });
      try {
        const decimalAdjustedCap = input.cap
          ? input.cap * BigInt(10 ** input.decimals)
          : BigInt(0);

        const deployTxData = encodeFunctionData({
          functionName: "deployAndRegisterStandardizedToken",
          args: [
            salt,
            input.tokenName,
            input.tokenSymbol,
            input.decimals,
            decimalAdjustedCap,
            input.mintTo ?? deployerAddress,
          ],
          abi: INTERCHAIN_TOKEN_SERVICE_ABI,
        });

        const totalGasFee = input.gasFees.reduce(
          (acc, gasFee) => acc + gasFee,
          BigInt(0)
        );

        const registerTxData = input.destinationChainIds.map((chainId, i) => {
          const gasFee = input.gasFees[i];
          const args = [
            salt,
            input.tokenName,
            input.tokenSymbol,
            input.decimals,
            "0x",
            input.mintTo ?? deployerAddress,
            chainId,
            gasFee,
          ] as const;

          return encodeFunctionData({
            functionName: "deployAndRegisterRemoteStandardizedToken",
            args: args,
            abi: INTERCHAIN_TOKEN_SERVICE_ABI,
          });
        });

        const tx = await multicallAsync({
          value: totalGasFee,
          args: [[deployTxData, ...registerTxData]],
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

          logger.error("Failed to deploy interchain token", error.cause);
        }

        console.error({ error });
      }
    }
  );
}
