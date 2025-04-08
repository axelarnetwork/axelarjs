import { useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { type SuiTransactionBlockResponse } from "@mysten/sui/client";

import { suiClient } from "~/lib/clients/suiClient";
import { useAccount } from "~/lib/hooks";
import { trpc } from "~/lib/trpc";
import {
  findCoinDataObject,
  findGatewayEventIndex,
} from "~/server/routers/sui/utils/utils";
import { useCanonicalTokenDeploymentStateContainer } from "../CanonicalTokenDeployment";

/**
 * Parameters for registering a canonical token.
 */
export type RegisterCanonicalTokenParams = {
  destinationChains: string[];
  coinType: string;
  gasValues: bigint[];
};

export type RegisterCanonicalTokenResult = SuiTransactionBlockResponse & {
  tokenManagerAddress: string;
  tokenManagerType: "lock_unlock";
  deploymentMessageId?: string;
};

/**
 * Hook to register a canonical token on Sui and deploy it to remote chains via ITS.
 *
 * This hook prepares and executes a transaction that:
 * 1. Registers an existing Sui coin (identified by `tokenPackageId` and `symbol`) with the Interchain Token Service (ITS).
 * 2. Deploys the interchain token representation to the specified `destinationChains`.
 *
 * @returns An object containing:
 *  - `registerCanonicalToken`: An async function to trigger the registration process.
 *  - `account`: The current connected Sui account, if any.
 */
export default function useRegisterCanonicalToken() {
  const currentAccount = useAccount();
  const { actions } = useCanonicalTokenDeploymentStateContainer();

  const { mutateAsync: signAndExecuteTransaction } =
    useSignAndExecuteTransaction({
      execute: async ({ bytes, signature }) => {
        const result = await suiClient.executeTransactionBlock({
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

  const { mutateAsync: getRegisterTxJson } =
    trpc.sui.getRegisterAndDeployCanonicalTokenTx.useMutation();

  const registerCanonicalToken = async ({
    destinationChains,
    coinType,
    gasValues,
  }: RegisterCanonicalTokenParams): Promise<RegisterCanonicalTokenResult> => {
    if (!currentAccount) {
      throw new Error("Wallet not connected");
    }

    // Set initial state before starting
    actions.setTxState({ type: "pending_approval" });

    try {
      const txJson = await getRegisterTxJson({
        sender: currentAccount.address,
        destinationChains,
        coinType,
        gasValues,
      });

      const result = await signAndExecuteTransaction({
        transaction: txJson,
      });

      const coinManagementObjectId = findCoinDataObject(result);

      const txIndex = findGatewayEventIndex(result?.events || []);
      const deploymentMessageId = `${result?.digest}-${txIndex}`;

      return {
        ...result,
        deploymentMessageId,
        tokenManagerAddress: coinManagementObjectId || "0x",
        tokenManagerType: "lock_unlock",
      };
    } catch (error) {
      actions.setTxState({
        type: "idle",
      });

      console.error("Canonical Token Registration failed:", error);
      // Re-throw the error to be handled by the caller
      throw error;
    }
  };

  return {
    registerCanonicalToken,
    isConnected: !!currentAccount,
    account: currentAccount,
  };
}
