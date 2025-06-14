import { toast } from "@axelarjs/ui/toaster";
import { useCallback } from "react";

import { useStellarKit } from "~/lib/providers/StellarWalletKitProvider";
import { trpc } from "~/lib/trpc";
import { useStellarTransactionSigner } from "./useStellarTransactionSigner";

interface MintStellarTokensParams {
  amount: string;
  tokenAddress: string;
  toAddress?: string;
  onSuccess?: () => void;
}

export default function useMintStellarTokens() {
  const { kit } = useStellarKit();
  const { signAndSubmitTransaction } = useStellarTransactionSigner();
  const utils = trpc.useUtils();
  const { mutateAsync: getMintTx } =
    trpc.stellar.getMintTokenTxBytes.useMutation({
      onError(error) {
        console.log("error in getMintTx", error.message);
      },
    });

  const mintTokens = useCallback(
    async ({
      amount,
      tokenAddress,
      toAddress,
      onSuccess,
    }: MintStellarTokensParams) => {
      if (!kit) {
        throw new Error("Stellar wallet not connected");
      }
      try {
        // Get the user's public key
        let publicKey: string;
        try {
          const { address } = await kit.getAddress();
          publicKey = address;
          if (!publicKey) throw new Error();
        } catch (e) {
          throw new Error("Failed to get public key from wallet");
        }

        // Use the user's address as recipient if not specified
        const recipient = toAddress || publicKey;

        // Get the transaction XDR from the server
        const { transactionXDR } = await getMintTx({
          caller: publicKey,
          toAddress: recipient,
          tokenAddress: tokenAddress,
          amount,
        });

        const result = await signAndSubmitTransaction({
          kit,
          transactionXDR,
        });

        // Invalidate all balance queries to refresh the UI
        await utils.interchainToken.getInterchainTokenBalanceForOwner.invalidate();

        // Call onSuccess callback if provided
        if (onSuccess) {
          onSuccess();
        }

        return {
          hash: result.hash,
          status: "success",
        };
      } catch (error) {
        console.error("Failed to mint Stellar tokens:", error);

        if ((error as Error).message.includes("not an authorized minter")) {
          toast.error(
            "You are not authorized to mint this token. Only designated minters can mint tokens."
          );
        } else {
          toast.error(`Failed to mint tokens: ${(error as Error).message}`);
        }

        throw error;
      }
    },
    [
      kit,
      getMintTx,
      utils.interchainToken.getInterchainTokenBalanceForOwner,
      signAndSubmitTransaction,
    ]
  );

  return mintTokens;
}
