import { useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { getFullnodeUrl } from "@mysten/sui.js/client";
import { fromHEX } from "@mysten/sui.js/utils";
import { SuiClient } from "@mysten/sui/client";
import { Transaction } from "@mysten/sui/transactions";

import { useAccount } from "~/lib/hooks";
import { trpc } from "~/lib/trpc";

export default function useTokenDeploy() {
  const currentAccount = useAccount();
  const client = new SuiClient({ url: getFullnodeUrl("testnet") });
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
  const { mutateAsync: getDeployTokenTxBytes } =
    trpc.sui.getDeployTokenTxBytes.useMutation({
      onError(error) {
        console.log("error in usedeploytoken", error.message);
      },
      onSuccess() {
        console.log("success in usedeploytoken");
      },
    });
  const { mutateAsync: getRegisterTokenTx } =
    trpc.sui.getRegisterTokenTx.useMutation({
      onSuccess() {
        console.log("success in getRegisterTokenTx");
      },
      onError(error) {
        console.log("error in getRegisterTokenTx", error.message);
      },
    });
  const { mutateAsync: getSendTokenDeploymentTxBytes } =
    trpc.sui.getSendTokenDeploymentTx.useMutation({
      onSuccess() {
        console.log("success in getSendTokenDeploymentTxBytes");
      },
      onError(error) {
        console.log("error in getSendTokenDeploymentTxBytes", error.message);
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
      const deployTokenTxBytes = await getDeployTokenTxBytes({
        symbol,
        name,
        decimals,
        skipRegister,
        walletAddress: currentAccount.address,
      });
      // First step, deploy the token
      const deployTokenTx = Transaction.from(fromHEX(deployTokenTxBytes));
      const deployTokenResult = await signAndExecuteTransaction({
        transaction: deployTokenTx,
        chain: "sui:testnet",
      });

      // Second step, register the token
      const registerTokenTxJSON = await getRegisterTokenTx({
        sender: currentAccount.address,
        symbol,
        transaction: deployTokenResult,
      });
      const registerTokenTx = Transaction.from(registerTokenTxJSON as string);
      const registerTokenResult = await signAndExecuteTransaction({
        transaction: registerTokenTx,
        chain: "sui:testnet",
      });
      // Third step, send the token
      const sendTokenTxJSON = await getSendTokenDeploymentTxBytes({
        sender: currentAccount.address,
        symbol,
        registerTokenTx: registerTokenResult,
        deployTokenTx: deployTokenResult,
      });
      const sendTokenTx = Transaction.from(sendTokenTxJSON as string);
      await signAndExecuteTransaction({
        transaction: sendTokenTx,
        chain: "sui:testnet",
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
