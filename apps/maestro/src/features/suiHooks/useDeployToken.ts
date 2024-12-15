import { useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import {
  getFullnodeUrl,
  type SuiTransactionBlockResponse,
} from "@mysten/sui.js/client";
import { fromHEX } from "@mysten/sui.js/utils";
import { SuiClient, SuiObjectChange } from "@mysten/sui/client";
import { Transaction } from "@mysten/sui/transactions";

import { useAccount } from "~/lib/hooks";
import { trpc } from "~/lib/trpc";

const findCoinDataObject = (
  registerTokenResult: SuiTransactionBlockResponse
) => {
  return (
    registerTokenResult?.objectChanges?.find(
      (change) =>
        change.type === "created" && change.objectType.includes("coin_data")
    ) as SuiObjectCreated
  )?.objectId;
};

export type DeployTokenParams = {
  initialSupply: bigint;
  symbol: string;
  name: string;
  decimals: number;
  destinationChainIds: string[];
  skipRegister?: boolean;
};

type SuiObjectCreated =
  | Extract<SuiObjectChange, { type: "created" }>
  | undefined;
const findObjectByType = (
  objectChanges: SuiObjectChange[],
  type: string
): SuiObjectCreated => {
  return objectChanges.find(
    (change) => change.type === "created" && change.objectType.includes(type)
  ) as SuiObjectCreated;
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

  const { mutateAsync: getMintTx } = trpc.sui.getMintTx.useMutation({
    onError(error) {
      console.log("error in getMintTx", error.message);
    },
  });

  const { mutateAsync: getRegisterAndSendTokenDeploymentTxBytes } =
    trpc.sui.getRegisterAndDeployTokenTx.useMutation({
      onError(error) {
        console.log("error in getSendTokenDeploymentTxBytes", error.message);
      },
    });

  const deployToken = async ({
    initialSupply,
    symbol,
    name,
    decimals,
    destinationChainIds,
    skipRegister = false,
  }: DeployTokenParams) => {
    console.log("deployToken", symbol, name, decimals, destinationChainIds);
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

      if (!deployTokenResult?.objectChanges) {
        throw new Error("Failed to deploy token");
      }

      const deploymentCreatedObjects = deployTokenResult.objectChanges.filter(
        (objectChange: SuiObjectChange) =>
          objectChange.type === "created" &&
          !objectChange.objectType.includes("q::Q")
      ); // exclude the template token that included with this package

      const treasuryCap = findObjectByType(
        deploymentCreatedObjects,
        "TreasuryCap"
      );

      const metadata = findObjectByType(deploymentCreatedObjects, "Metadata");

      const tokenAddress = metadata?.objectType.match(/<([^:>]+)/)?.[1];

      if (!tokenAddress) {
        throw new Error("Failed to deploy token");
      }

      // if treasury cap is null then it is lock/unlock, otherwise it is mint/burn
      const tokenManagerType = treasuryCap ? "mint/burn" : "lock/unlock";

      const sendTokenTxJSON = await getRegisterAndSendTokenDeploymentTxBytes({
        sender: currentAccount.address,
        symbol,
        tokenPackageId: tokenAddress,
        metadataId: metadata.objectId,
        destinationChains: destinationChainIds,
      });
      const sendTokenTx = Transaction.from(sendTokenTxJSON as string);
      const sendTokenResult = await signAndExecuteTransaction({
        transaction: sendTokenTx,
        chain: "sui:testnet", //TODO: make this dynamic
      });
      const coinManagementObjectId = findCoinDataObject(
        sendTokenResult as SuiTransactionBlockResponse
      );

      // Mint tokens
      if (treasuryCap) {
        const mintTxJSON = await getMintTx({
          sender: currentAccount.address,
          tokenTreasuryCap: treasuryCap?.objectId,
          amount: initialSupply,
          tokenPackageId: tokenAddress,
          symbol,
        });
        const mintTx = Transaction.from(mintTxJSON as string);
        await signAndExecuteTransaction({
          transaction: mintTx,
          chain: "sui:testnet",
        });
      }

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
