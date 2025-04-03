import { useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { type SuiTransactionBlockResponse } from "@mysten/sui/client";
import { suiClient } from "~/lib/clients/suiClient";

import { useAccount } from "~/lib/hooks";
import { trpc } from "~/lib/trpc";
import { useCanonicalTokenDeploymentStateContainer } from "../CanonicalTokenDeployment";
import { findCoinDataObject, getPackageIdFromSuiTokenAddress } from "~/server/routers/sui/utils/utils";

/**
 * Parameters for registering a canonical token.
 */
export type RegisterCanonicalTokenParams = {
  symbol: string;
  destinationChains: string[];
  tokenPackageId: string;
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
    symbol,
    destinationChains,
    tokenPackageId,
    gasValues,
  }: RegisterCanonicalTokenParams): Promise<RegisterCanonicalTokenResult> => {
    if (!currentAccount) {
      throw new Error("Wallet not connected");
    }
    const suiTokenPackageId = getPackageIdFromSuiTokenAddress(tokenPackageId);

    // Set initial state before starting
    actions.setTxState({ type: "pending_approval" });

    try {
      const txJson = await getRegisterTxJson({
        sender: currentAccount.address,
        symbol,
        destinationChains,
        tokenPackageId: suiTokenPackageId,
        gasValues,
      });

      const result = await signAndExecuteTransaction({
        transaction: txJson,
      });

      const coinManagementObjectId = findCoinDataObject(result);

      const tokenManagerType = "lock_unlock";

      const txIndex = result?.events?.[3]?.id?.eventSeq ?? 0; // TODO: find the correct txIndex, it seems to be always 3
      const deploymentMessageId = `${result?.digest}-${txIndex}`;

      return {
        ...result,
        deploymentMessageId,
        tokenManagerAddress: coinManagementObjectId || "0x",
        tokenManagerType,
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

