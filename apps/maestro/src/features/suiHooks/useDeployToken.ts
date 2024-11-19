import { useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { getFullnodeUrl } from "@mysten/sui.js/client";
import { fromHEX } from "@mysten/sui.js/utils";
import { SuiClient } from "@mysten/sui/client";
import { Transaction } from "@mysten/sui/transactions";

import { useAccount } from "~/lib/hooks";
import { trpc } from "~/lib/trpc";

const findCoinDataObject = (registerTokenResult: any) => {
  return registerTokenResult.objectChanges.find(
    (change) =>
      change.type === "created" && change.objectType.includes("coin_data")
  ).objectId;
};

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
    });
  const { mutateAsync: getRegisterTokenTx } =
    trpc.sui.getRegisterTokenTx.useMutation({
      onError(error) {
        console.log("error in getRegisterTokenTx", error.message);
      },
    });
  const { mutateAsync: getSendTokenDeploymentTxBytes } =
    trpc.sui.getSendTokenDeploymentTx.useMutation({
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

      // get coin package id and treasury cap
      // TODO: check if this works for lock/unlock
      const treasuryCaps = deployTokenResult?.objectChanges
        .filter(
          (change) =>
            change.type === "created" &&
            change.objectType.includes("TreasuryCap")
        )
        .map((cap) => ({
          packageId: cap.objectType?.split("<")[1].split(">")[0].split(":")[0], // equivalent to token address
          treasuryCapId: cap.objectId,
        }));
      const tokenAddress = treasuryCaps[0].packageId;
      // if treasury cap is null then it is lock/unlock, otherwise it is mint/burn
      const tokenManagerType = treasuryCaps[0].treasuryCapId
        ? "mint/burn"
        : "lock/unlock";

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
      const coinManagementObjectId = findCoinDataObject(registerTokenResult);

      // Third step, send the token
      const sendTokenTxJSON = await getSendTokenDeploymentTxBytes({
        sender: currentAccount.address,
        symbol,
        registerTokenTx: registerTokenResult,
        deployTokenTx: deployTokenResult,
      });
      const sendTokenTx = Transaction.from(sendTokenTxJSON as string);
      const sendTokenResult = await signAndExecuteTransaction({
        transaction: sendTokenTx,
        chain: "sui:testnet",
      });
      return {
        ...sendTokenResult,
        tokenManagerAddress: coinManagementObjectId,
        tokenAddress,
        tokenManagerType,
      };
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
