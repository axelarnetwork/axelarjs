import { INTERCHAIN_TOKEN_ENCODERS } from "@axelarjs/evm";
import { toast } from "@axelarjs/ui/toaster";

import { useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { useMutation } from "@tanstack/react-query";
import { parseUnits, TransactionExecutionError } from "viem";

import { suiClient as client } from "~/lib/clients/suiClient";
import { useWriteInterchainTokenInterchainTransfer } from "~/lib/contracts/InterchainToken.hooks";
import { useAccount, useChainId } from "~/lib/hooks";
import { useTransactionState } from "~/lib/hooks/useTransactionState";
import { logger } from "~/lib/logger";
import { trpc } from "~/lib/trpc";

export type UseSendInterchainTokenConfig = {
  tokenAddress: string;
  sourceChainName: string;
  destinationChainName: string;
  gas?: bigint;
  tokenId?: string;
  destinationAddress?: string;
};

export type UseSendInterchainTokenInput = {
  tokenAddress: `0x${string}`;
  amount: string;
  tokenId?: string;
  destinationAddress?: string;
  decimals?: number;
};

export function useInterchainTransferMutation(
  config: UseSendInterchainTokenConfig
) {
  const [txState, setTxState] = useTransactionState();

  const chainId = useChainId();

  const { address } = useAccount();

  const { writeContractAsync: transferAsync } =
    useWriteInterchainTokenInterchainTransfer();

  const { mutateAsync: getSendTokenTx } = trpc.sui.getSendTokenTx.useMutation({
    onError(error) {
      console.log("error in getSendTokenTx", error.message);
    },
  });

  const { mutateAsync: signAndExecuteTransaction } =
    useSignAndExecuteTransaction({
      execute: async ({ bytes, signature }) => {
        const result = await client.executeTransactionBlock({
          transactionBlock: bytes,
          signature,
          options: {
            showObjectChanges: true,
            showEvents: true,
            showEffects: true,
            showRawEffects: true,
          },
        });
        return result;
      },
    });

  const mutation = useMutation<void, unknown, UseSendInterchainTokenInput>({
    mutationFn: async ({ amount, tokenId, destinationAddress, decimals }) => {
      if (
        !(decimals && address && config.gas && tokenId && destinationAddress)
      ) {
        return;
      }

      const bnAmount = parseUnits(amount, decimals);
      try {
        setTxState({
          status: "awaiting_approval",
        });
        let txHash: any;
        if (config.sourceChainName.toLowerCase().includes("sui")) {
          const sendTokenTxJSON = await getSendTokenTx({
            sender: address,
            tokenId: tokenId,
            amount: bnAmount.toString(),
            destinationChain: config.destinationChainName,
            destinationAddress: destinationAddress,
            gas: config.gas.toString() ?? "0",
            coinType: config.tokenAddress,
          });
          const receipt = await signAndExecuteTransaction({
            transaction: sendTokenTxJSON,
          });
          txHash = receipt.digest;
        } else {
          const recipient = (destinationAddress ?? address) as `0x${string}`;
          txHash = await transferAsync({
            address: config.tokenAddress as `0x${string}`,
            value: config.gas ?? 0n,
            args: INTERCHAIN_TOKEN_ENCODERS.interchainTransfer.args({
              destinationChain: config.destinationChainName,
              recipient,
              amount: bnAmount,
              metadata: "0x",
            }),
          });
        }
        if (txHash) {
          setTxState({
            status: "submitted",
            hash: txHash,
            chainId,
          });
        }
      } catch (error) {
        if (error instanceof TransactionExecutionError) {
          toast.error(`Transaction failed: ${error.cause.shortMessage}`);
          logger.error("Failed to transfer token:", error.cause);

          setTxState({
            status: "idle",
          });
          return;
        }

        if (error instanceof Error) {
          setTxState({
            status: "reverted",
            error: error,
          });
        } else {
          setTxState({
            status: "reverted",
            error: new Error("failed to transfer token"),
          });
        }

        return;
      }
    },
  });

  return {
    ...mutation,
    txState,
    reset: () => {
      setTxState({ status: "idle" });
      mutation.reset();
    },
  };
}
