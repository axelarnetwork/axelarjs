import { useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import type { SuiTransactionBlockResponse } from "@mysten/sui/client";

import { suiClient as client } from "~/lib/clients/suiClient";
import { useAccount } from "~/lib/hooks";
import { trpc } from "~/lib/trpc";

interface MintTokensParams {
  amount: bigint;
  symbol: string;
  tokenAddress: string;
  tokenId: string;
}

export default function useMintTokens() {
  const currentAccount = useAccount();
  const utils = trpc.useUtils();

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

  const { mutateAsync: getMintTx } =
    trpc.sui.getMintAsDistributorTx.useMutation({
      onError(error) {
        console.log("error in getMintTx", error.message);
      },
    });

  const mintTokens = async ({
    amount,
    symbol,
    tokenAddress,
    tokenId,
  }: MintTokensParams): Promise<SuiTransactionBlockResponse> => {
    if (!currentAccount) {
      throw new Error("Wallet not connected");
    }
    try {
      const mintTxJSON = await getMintTx({
        sender: currentAccount.address,
        tokenId: tokenId,
        tokenPackageId: tokenAddress,
        amount: amount,
        symbol,
      });

      const result = await signAndExecuteTransaction({
        transaction: mintTxJSON,
      });

      // Invalidate all balance queries
      await utils.interchainToken.getInterchainTokenBalanceForOwner.invalidate();

      return result;
    } catch (error) {
      console.error("Failed to mint tokens:", error);
      throw error;
    }
  };

  return mintTokens;
}
