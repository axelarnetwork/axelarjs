import { toast } from "@axelarjs/ui/toaster";
import { useCallback } from "react";

import type { StellarWalletsKit } from "@creit.tech/stellar-wallets-kit";
import { rpc, Transaction } from "@stellar/stellar-sdk";

import { NEXT_PUBLIC_STELLAR_NETWORK_PASSPHRASE } from "~/config/env";
import { useStellarKit } from "~/lib/providers/StellarWalletKitProvider";
import { trpc } from "~/lib/trpc";
import { STELLAR_RPC_URL } from "~/server/routers/stellar/utils/config";

interface MintStellarTokensParams {
  amount: string;
  toAddress?: string;
}

export default function useMintStellarTokens() {
  const { kit } = useStellarKit();
  const utils = trpc.useUtils();

  const { mutateAsync: getMintTx } =
    trpc.stellar.getMintTokenTxBytes.useMutation({
      onError(error) {
        console.log("error in getMintTx", error.message);
        toast.error(`Failed to prepare mint transaction: ${error.message}`);
      },
    });

  const mintTokens = useCallback(
    async ({ amount, toAddress }: MintStellarTokensParams) => {
      if (!kit) {
        throw new Error("Stellar wallet not connected");
      }

      try {
        // Usar o kit como any para contornar problemas de tipagem
        const stellarKit = kit;

        // Tentar obter a chave pública do usuário
        let publicKey: string;
        try {
          const { address } = await stellarKit.getAddress();
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
          amount,
        });

        // Sign the transaction usando o stellarKit como any
        const { signedTxXdr } = await stellarKit.signTransaction(
          transactionXDR,
          {
            networkPassphrase: NEXT_PUBLIC_STELLAR_NETWORK_PASSPHRASE || "",
          }
        );

        // Submit the transaction
        const server = new rpc.Server(STELLAR_RPC_URL, {
          allowHttp: STELLAR_RPC_URL.startsWith("http://"),
        });

        const tx = new Transaction(
          signedTxXdr,
          NEXT_PUBLIC_STELLAR_NETWORK_PASSPHRASE || ""
        );

        const result = await server.sendTransaction(tx);

        // Invalidate all balance queries to refresh the UI
        await utils.interchainToken.getInterchainTokenBalanceForOwner.invalidate();

        return {
          hash: result.hash,
          status: "success",
        };
      } catch (error) {
        console.error("Failed to mint Stellar tokens:", error);
        toast.error(`Failed to mint tokens: ${(error as Error).message}`);
        throw error;
      }
    },
    [kit, getMintTx, utils.interchainToken.getInterchainTokenBalanceForOwner]
  );

  return mintTokens;
}
