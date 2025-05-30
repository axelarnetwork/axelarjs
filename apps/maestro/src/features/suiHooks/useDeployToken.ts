import { useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import {
  SuiObjectChange,
  type SuiTransactionBlockResponse,
} from "@mysten/sui/client";
import { Transaction } from "@mysten/sui/transactions";
import { fromHex } from "@mysten/sui/utils";

import { suiClient as client } from "~/lib/clients/suiClient";
import { useAccount } from "~/lib/hooks";
import { trpc } from "~/lib/trpc";
import {
  findCoinDataObject,
  findGatewayEventIndex,
  findObjectByType,
} from "~/server/routers/sui/utils/utils";
import { useInterchainTokenDeploymentStateContainer } from "../InterchainTokenDeployment";

export type DeployTokenParams = {
  initialSupply: bigint;
  symbol: string;
  name: string;
  decimals: number;
  destinationChainIds: string[];
  gasValues: bigint[];
  skipRegister?: boolean;
  minterAddress?: string;
};

export type DeployTokenResult = SuiTransactionBlockResponse & {
  tokenManagerAddress: string;
  tokenAddress: string;
  tokenManagerType: "mint_burn" | "lock_unlock";
  deploymentMessageId?: string;
  minterAddress?: string;
};

export default function useTokenDeploy() {
  const currentAccount = useAccount();
  const { actions: rootActions } = useInterchainTokenDeploymentStateContainer();
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
    gasValues,
    skipRegister = false,
    minterAddress,
  }: DeployTokenParams): Promise<DeployTokenResult> => {
    if (!currentAccount) {
      throw new Error("Wallet not connected");
    }

    // First step, deploy the token
    rootActions.setTxState({
      type: "pending_approval",
      step: 1,
      totalSteps: 2,
    });
    try {
      const deployTokenTxBytes = await getDeployTokenTxBytes({
        symbol,
        name,
        decimals,
        skipRegister,
        walletAddress: currentAccount.address,
      });
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

      const coinType = metadata?.objectType.match(/<([^>]+)>/)?.[1];

      if (!coinType) {
        throw new Error("Failed to deploy token");
      }
      rootActions.setTxState({
        type: "pending_approval",
        step: 2,
        totalSteps: 2,
      });

      let sendTokenTxJSON;
      if (treasuryCap) {
        sendTokenTxJSON = await getRegisterAndSendTokenDeploymentTxBytes({
          sender: currentAccount.address,
          symbol,
          coinType,
          tokenId: metadata.objectId,
          amount: initialSupply,
          destinationChains: destinationChainIds,
          minterAddress: minterAddress,
          gasValues,
        });
      } else {
        throw new Error(
          "Failed to get register and send token deployment tx bytes, missing treasury cap"
        );
      }

      if (!sendTokenTxJSON) {
        throw new Error(
          "Failed to get register and send token deployment tx bytes"
        );
      }

      const sendTokenResult = await signAndExecuteTransaction({
        transaction: sendTokenTxJSON,
      });
      const coinManagementObjectId = findCoinDataObject(sendTokenResult);

      minterAddress = minterAddress || currentAccount.address;
      const txIndex = findGatewayEventIndex(sendTokenResult?.events || []);
      const deploymentMessageId = `${sendTokenResult?.digest}-${txIndex}`;
      return {
        ...sendTokenResult,
        deploymentMessageId,
        tokenManagerAddress: coinManagementObjectId || "0x",
        tokenAddress: coinType,
        tokenManagerType: "mint_burn",
        minterAddress,
      };
    } catch (error) {
      rootActions.setTxState({
        type: "idle",
      });
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
