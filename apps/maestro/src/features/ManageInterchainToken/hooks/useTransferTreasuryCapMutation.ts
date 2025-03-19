import { useSignAndExecuteTransaction } from "@mysten/dapp-kit";

import { suiClient as client } from "~/lib/clients/suiClient";
import { useAccount, useChainId } from "~/lib/hooks";
import { useTransactionState } from "~/lib/hooks/useTransactionState";
import { trpc } from "~/lib/trpc";

export function useTransferTreasuryCapMutation() {
  const [txState, setTxState] = useTransactionState();
  const chainId = useChainId();
  const { address } = useAccount();

  const { mutateAsync: getTransferTreasuryCapTx } =
    trpc.sui.getTransferTreasuryCapTx.useMutation({
      onError(error: any) {
        console.log("error in getTransferTreasuryCapTx", error.message);
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
    transferTreasuryCap: async (
      tokenAddress: string,
      recipientAddress: string
    ) => {
      if (!address) return;

      try {
        setTxState({
          status: "awaiting_approval",
        });

        const treasuryCapTxJSON = await getTransferTreasuryCapTx({
          tokenAddress,
          recipientAddress,
          sender: address,
        });

        const result = await signAndExecuteTransaction({
          transaction: treasuryCapTxJSON,
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
