import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
} from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";

import { trpc } from "~/lib/trpc";

export default function useTokenDeploy() {
  const currentAccount = useCurrentAccount();
  const { mutateAsync: signAndExecuteTransaction } =
    useSignAndExecuteTransaction();
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
      const { serializedTx: txJSON } = await mutateAsync({
        symbol,
        name,
        decimals,
        skipRegister,
        walletAddress: currentAccount.address,
      });

      // Deserialize the transaction from JSON
      console.log("txJSON", txJSON);
      const tx = Transaction.from(txJSON);
      console.log("tx", tx);
      const result = await signAndExecuteTransaction({
        transaction: tx,
        chain: "sui:testnet",
      });
      console.log("result of signAndExecuteTransaction", result);

      return finalizeDeployment({
        symbol,
        decimals,
        skipRegister,
        txDigest: deployResult.digest,
        objectChanges: deployResult.objectChanges || [],
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
