import { useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import {
  SuiObjectChange,
  type SuiTransactionBlockResponse,
} from "@mysten/sui/client";
import { Transaction } from "@mysten/sui/transactions";
import { fromHex } from "@mysten/sui/utils";

import { suiClient as client } from "~/server/routers/sui";
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

export type DeployTokenResult = SuiTransactionBlockResponse & {
  tokenManagerAddress: string;
  tokenAddress: string;
  tokenManagerType: "mint/burn" | "lock/unlock";
  deploymentMessageId?: string;
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
  }: DeployTokenParams): Promise<DeployTokenResult> => {
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
      const deployTokenTx = Transaction.from(fromHex(deployTokenTxBytes));
      const deployTokenResult = await signAndExecuteTransaction({
        transaction: await deployTokenTx.toJSON(),
      });

      if (!deployTokenResult?.objectChanges) {
        throw new Error("Failed to deploy token");
      }

      const deploymentCreatedObjects = deployTokenResult.objectChanges.filter(
        (objectChange: SuiObjectChange) => objectChange.type === "created"
      );

      const treasuryCap = findObjectByType(
        deploymentCreatedObjects,
        "TreasuryCap"
      );

      const metadata = findObjectByType(deploymentCreatedObjects, "Metadata");

      const tokenAddress = metadata?.objectType.match(/<([^:>]+)/)?.[1];

      if (!tokenAddress) {
        throw new Error("Failed to deploy token");
      }

      // Mint tokens before registering, as the treasury cap will be transferred to the ITS contract
      // TODO: should merge this with above to avoid multiple transactions.
      // we can do this once we know whether the token is mint/burn or lock/unlock
      if (treasuryCap) {
        const mintTxJSON = await getMintTx({
          sender: currentAccount.address,
          tokenTreasuryCap: treasuryCap?.objectId,
          amount: initialSupply,
          tokenPackageId: tokenAddress,
          symbol,
        });
        await signAndExecuteTransaction({
          transaction: mintTxJSON,
        });
      }

      const sendTokenTxJSON = await getRegisterAndSendTokenDeploymentTxBytes({
        sender: currentAccount.address,
        symbol,
        tokenPackageId: tokenAddress,
        metadataId: metadata.objectId,
        destinationChains: destinationChainIds,
      });

      if (!sendTokenTxJSON) {
        throw new Error(
          "Failed to get register and send token deployment tx bytes"
        );
      }

      const sendTokenResult = await signAndExecuteTransaction({
        transaction: sendTokenTxJSON,
      });
      const coinManagementObjectId = findCoinDataObject(sendTokenResult);

      // find treasury cap in the sendTokenResult to determine the token manager type
      const sendTokenObjects = sendTokenResult?.objectChanges;
      const treasuryCapSendTokenResult = findObjectByType(
        sendTokenObjects as SuiObjectChange[],
        "TreasuryCap"
      );
      const tokenManagerType = treasuryCapSendTokenResult
        ? "mint/burn"
        : "lock/unlock";
      const txIndex = sendTokenResult?.events?.[3]?.id?.eventSeq ?? 0; // TODO: find the correct txIndex, it seems to be always 3
      const deploymentMessageId = `${sendTokenResult?.digest}-${txIndex}`;
      return {
        ...sendTokenResult,
        deploymentMessageId,
        tokenManagerAddress: coinManagementObjectId || "0x",
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
