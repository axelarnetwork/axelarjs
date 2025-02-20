import { useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import type { SuiTransactionBlockResponse } from "@mysten/sui/client";

import { suiClient as client } from "~/lib/clients/suiClient";
import { useAccount } from "~/lib/hooks";
import { trpc } from "~/lib/trpc";
import { getTreasuryCap } from "~/server/routers/sui/utils/utils";

interface MintTokensParams {
  amount: bigint;
  symbol: string;
  tokenAddress: string;
}

export default function useMintTokens() {
  const currentAccount = useAccount();

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

  const { mutateAsync: getMintTx } = trpc.sui.getMintTx.useMutation({
    onError(error) {
      console.log("error in getMintTx", error.message);
    },
  });

  const mintTokens = async ({
    amount,
    symbol,
    tokenAddress,
  }: MintTokensParams): Promise<SuiTransactionBlockResponse> => {
    if (!currentAccount) {
      throw new Error("Wallet not connected");
    }
    const treasuryCapId = await getTreasuryCap(tokenAddress);
    if (!treasuryCapId) throw new Error("Treasury cap not found");
    try {
      const mintTxJSON = await getMintTx({
        sender: currentAccount.address,
        tokenTreasuryCap: treasuryCapId,
        tokenPackageId: tokenAddress,
        amount: amount,
        symbol,
      });

      const result = await signAndExecuteTransaction({
        transaction: mintTxJSON,
      });

      return result;
    } catch (error) {
      console.error("Failed to mint tokens:", error);
      throw error;
    }
  };

  return mintTokens;
}
