import { INTERCHAIN_TOKEN_SERVICE_ABI } from "@axelarjs/evm";
import { toast } from "@axelarjs/ui";
import { hexlify, hexZeroPad, throttle } from "@axelarjs/utils";
import { useMemo } from "react";

import { encodeFunctionData, TransactionExecutionError } from "viem";
import {
  useAccount,
  useMutation,
  useWaitForTransaction,
  useWalletClient,
} from "wagmi";

import {
  prepareWriteInterchainTokenService,
  watchInterchainTokenServiceEvent,
} from "~/lib/contracts/InterchainTokenService.actions";
import {
  useInterchainTokenServiceGetCustomTokenId,
  useInterchainTokenServiceGetStandardizedTokenAddress,
  useInterchainTokenServiceMulticall,
} from "~/lib/contracts/InterchainTokenService.hooks";
import { logger } from "~/lib/logger";
import { isValidEVMAddress } from "~/lib/utils/isValidEVMAddress";
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

export function useDeployInterchainTokenMutation(config: {
  value: bigint;
  onStatusUpdate?: (message: DeployAndRegisterTransactionState) => void;
  onFinished?: () => void;
}) {
  const signer = useWalletClient();

  const { address } = useAccount();

  const salt = useMemo(
    () =>
      hexZeroPad(
        hexlify(Math.floor(Math.random() * 1_000_000_000)),
        32
      ) as `0x${string}`,
    []
  );

  const { data: tokenId } = useInterchainTokenServiceGetCustomTokenId({
    args: [address as `0x${string}`, salt],
    enabled: address && isValidEVMAddress(address),
  });

  const { data: tokenAddress } =
    useInterchainTokenServiceGetStandardizedTokenAddress({
      args: [tokenId as `0x${string}`],
      enabled: Boolean(tokenId),
    });

  const { writeAsync: multicallAsync, data: multicallResult } =
    useInterchainTokenServiceMulticall();

  let currentInput: UseDeployAndRegisterInterchainTokenInput = {
    sourceChainId: "",
    tokenName: "",
    tokenSymbol: "",
    decimals: 0,
    destinationChainIds: [],
    gasFees: [],
    cap: BigInt(0),
    mintTo: `0x000`,
  };

  const onStatusUpdate = throttle(config.onStatusUpdate ?? (() => {}), 150);

  const unwatch = watchInterchainTokenServiceEvent(
    {
      eventName: "StandardizedTokenDeployed",
    },
    (logs) => {
      const log = logs.find(
        (log) =>
          Boolean(log.args?.tokenId) &&
          log?.args.decimals === currentInput.decimals &&
          log?.args.name === currentInput.tokenName &&
          log?.args.symbol === currentInput.tokenSymbol &&
          log?.args.mintTo === address
      );

      if (!log) {
        return;
      }

      unwatch();

      console.log("StandardizedTokenDeployed", { log, tokenId, tokenAddress });

      onStatusUpdate({
        type: "deployed",
        tokenAddress: tokenAddress as `0x${string}`,
        txHash: multicallResult?.hash as `0x${string}`,
      });
    }
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
      if (!(signer && address)) {
        return;
      }

      currentInput = input;

      onStatusUpdate({
        type: "pending_approval",
      });
      try {
        const deployTxData = encodeFunctionData({
          functionName: "deployAndRegisterStandardizedToken",
          args: [
            salt,
            input.tokenName,
            input.tokenSymbol,
            input.decimals,
            input.cap ?? BigInt(0),
            input.mintTo ?? address,
          ],
          abi: INTERCHAIN_TOKEN_SERVICE_ABI,
        });

        const totalGasFee = input.gasFees.reduce(
          (acc, gasFee) => acc + gasFee,
          BigInt(0)
        );

        const registerTxData = await Promise.all(
          input.destinationChainIds.map(async (chainId, i) => {
            console.log(input.gasFees);
            const gasFee = input.gasFees[i];
            const args = [
              salt,
              input.tokenName,
              input.tokenSymbol,
              input.decimals,
              input.mintTo ?? address,
              input.mintTo ?? address,
              chainId,
              gasFee,
            ] as const;

            try {
              const prepared = await prepareWriteInterchainTokenService({
                functionName: "deployAndRegisterRemoteStandardizedTokens",
                args: args,
                value: gasFee,
              });
              console.log({ prepared });
            } catch (error) {
              console.log({ error });
            }

            return encodeFunctionData({
              functionName: "deployAndRegisterRemoteStandardizedTokens",
              args: args,
              abi: INTERCHAIN_TOKEN_SERVICE_ABI,
            });
          })
        );

        // const multicallData = [deployTxData, ...registerTxData];

        console.log({
          tokenAddress,
          tokenId,
          deployTxData,
          registerTxData,
        });

        const tx = await multicallAsync({
          value: totalGasFee,
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

          logger.error("Failed to deploy interchain token", error.cause);
        }

        console.error({ error });
      }
    }
  );
}
