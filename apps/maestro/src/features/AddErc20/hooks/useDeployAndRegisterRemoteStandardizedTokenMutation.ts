import { INTERCHAIN_TOKEN_SERVICE_ABI } from "@axelarjs/evm";
import { toast } from "@axelarjs/ui";
import { throttle } from "@axelarjs/utils";
import { useEffect, useRef, useState } from "react";

import {
  encodeFunctionData,
  parseUnits,
  TransactionExecutionError,
} from "viem";
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
  initialSupply?: bigint;
  distributor?: `0x${string}`;
};

const DEFAULT_INPUT: UseDeployAndRegisterInterchainTokenInput = {
  sourceChainId: "",
  tokenName: "",
  tokenSymbol: "",
  decimals: 0,
  destinationChainIds: [],
  gasFees: [],
  initialSupply: BigInt(0),
  distributor: `0x000`,
};

export function useDeployAndRegisterRemoteStandardizedTokenMutation(config: {
  value: bigint;
  salt: `0x${string}`;
  onStatusUpdate?: (message: DeployAndRegisterTransactionState) => void;
  onFinished?: () => void;
}) {
  const inputRef =
    useRef<UseDeployAndRegisterInterchainTokenInput>(DEFAULT_INPUT);
  const { address: deployerAddress } = useAccount();
  const { chain } = useNetwork();

  const { data: tokenId } = useInterchainTokenServiceGetCustomTokenId({
    args: [deployerAddress as `0x${string}`, config.salt],
    enabled: deployerAddress && isValidEVMAddress(deployerAddress),
  });

  const { data: tokenAddress } =
    useInterchainTokenServiceGetStandardizedTokenAddress({
      args: [tokenId as `0x${string}`],
      enabled: Boolean(tokenId),
    });

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

      setRecordDeploymentArgs({
        kind: "standardized",
        salt: config.salt,
        tokenId,
        tokenAddress,
        deployerAddress,
        originChainId: chain.id,
        deploymentTxHash: log.transactionHash,
        tokenName: inputRef.current.tokenName,
        tokenSymbol: inputRef.current.tokenSymbol,
        tokenDecimals: inputRef.current.decimals,
        originAxelarChainId: inputRef.current.sourceChainId,
        remoteTokens: inputRef.current.destinationChainIds.map(
          (axelarChainId) => ({
            axelarChainId,
            chainId: computed.indexedById[axelarChainId]?.chain_id,
            address: tokenAddress,
            status: "pending",
            deplymentTxHash: log.transactionHash as `0x${string}`,
            // deploymentLogIndex is unknown at this point
          })
        ),
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
        const initialSupply = input.initialSupply
          ? parseUnits(String(input.initialSupply), input.decimals)
          : BigInt(0);

        const baseArgs = [
          config.salt,
          input.tokenName,
          input.tokenSymbol,
          input.decimals,
        ] as const;

        const deployTxData = encodeFunctionData({
          functionName: "deployAndRegisterStandardizedToken",
          abi: INTERCHAIN_TOKEN_SERVICE_ABI,
          args: [
            ...baseArgs,
            initialSupply,
            input.distributor ?? deployerAddress,
          ],
        });

        const totalGasFee = input.gasFees.reduce((a, b) => a + b, BigInt(0));

        const registerTxData = input.destinationChainIds.map((chainId, i) => {
          const gasFee = input.gasFees[i];

          return encodeFunctionData({
            functionName: "deployAndRegisterRemoteStandardizedToken",
            abi: INTERCHAIN_TOKEN_SERVICE_ABI,
            args: [
              ...baseArgs,
              "0x", // remote tokens cannot be minted, so the operator is 0x
              input.distributor ?? deployerAddress,
              chainId,
              gasFee,
            ],
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
      }
    }
  );
}
