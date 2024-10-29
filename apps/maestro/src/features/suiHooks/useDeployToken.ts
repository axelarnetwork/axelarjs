import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
} from "@mysten/dapp-kit";
import { getFullnodeUrl } from "@mysten/sui.js/client";
import { fromHEX } from "@mysten/sui.js/utils";
import { SuiClient } from "@mysten/sui/client";
import { Transaction } from "@mysten/sui/transactions";

import { trpc } from "~/lib/trpc";

export default function useTokenDeploy() {
  const currentAccount = useCurrentAccount();
  const client = new SuiClient({ url: getFullnodeUrl("testnet") });
  const { mutateAsync: signAndExecuteTransaction } =
    useSignAndExecuteTransaction({
      execute: async ({ bytes, signature }) => {
        const result = await client.executeTransactionBlock({
          transactionBlock: bytes,
          signature,
          options: {
            // Raw effects are required so the effects can be reported back to the wallet
            showRawEffects: true,
            // Select additional data to return
            showObjectChanges: true,
          },
        });
        return result;
      },
    });
  // 1. Get prepared deployment transaction
  const { mutateAsync } = trpc.sui.deployToken.useMutation({
    onError(error) {
      console.log("error in usedeploytoken", error.message);
    },
    onSuccess() {
      console.log("success in usedeploytoken");
    },
  });
  const { mutateAsync: finalizeDeployment } =
    trpc.sui.finalizeDeployment.useMutation({
      onSuccess() {
        console.log("success in finalizeDeployment");
      },
      onError(error) {
        console.log("error in finalizeDeployment", error.message);
      },
    });

  const deployToken = async ({
    symbol,
    name,
    decimals,
    skipRegister = false,
  }: {
    symbol: string;
    name: string;
    decimals: number;
    skipRegister?: boolean;
  }) => {
    if (!currentAccount) {
      throw new Error("Wallet not connected");
    }

    try {
      const txBytes = await mutateAsync({
        symbol,
        name,
        decimals,
        skipRegister,
        walletAddress: currentAccount.address,
      });
      // Create transaction from txBytes
      const tx = Transaction.from(fromHEX(txBytes));
      const result = await signAndExecuteTransaction({
        transaction: tx,
        chain: "sui:testnet",
      });

      return finalizeDeployment({
        symbol,
        decimals,
        skipRegister,
        txDigest: result.digest,
        objectChanges: result.objectChanges || [],
      });
    } catch (error) {
      console.error("Token deployment failed:", error);
      throw error;
    }
  };

  return {
    deployToken,
    isConnected: !!currentAccount,
    account: currentAccount,
  };
}
