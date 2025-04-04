import { useSignAndExecuteTransaction } from "@mysten/dapp-kit";

import { suiClient as client } from "~/lib/clients/suiClient";
import { useAccount, useChainId } from "~/lib/hooks";
import { useTransactionState } from "~/lib/hooks/useTransactionState";
import { trpc } from "~/lib/trpc";

export function useTransferOperatorshipMutation() {
  const [txState, setTxState] = useTransactionState();
  const chainId = useChainId();
  const { address } = useAccount();

  const { mutateAsync: getTransferOperatorshipTx } =
    trpc.sui.getTransferOperatorshipTx.useMutation({
      onError(error: any) {
        console.log("error in getTransferOperatorshipTx", error.message);
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

  return {
    txState,
    setTxState,
    transferOperatorship: async (
      tokenAddress: string,
      recipientAddress: string,
      tokenId: string,
      symbol: string
    ) => {
      if (!address) return;

      try {
        setTxState({
          status: "awaiting_approval",
        });

        const operatorshipTxJSON = await getTransferOperatorshipTx({
          tokenAddress,
          recipientAddress,
          sender: address,
          symbol,
          tokenId,
        });

        const result = await signAndExecuteTransaction({
          transaction: operatorshipTxJSON,
        });

        setTxState({
          status: "submitted",
          hash: result.digest,
          chainId,
          suiTx: result,
        });

        return result;
      } catch (error) {
        console.error("Failed to transfer treasury cap:", error);
        throw error;
      }
    },
  };
}
