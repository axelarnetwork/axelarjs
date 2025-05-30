import { useState } from "react";

import { rpc, Transaction } from "@stellar/stellar-sdk";

import { stellarChainConfig } from "~/config/chains";
import type { DeployAndRegisterTransactionState } from "~/features/InterchainTokenDeployment";
import { useCanonicalTokenDeploymentStateContainer } from "~/features/CanonicalTokenDeployment";
import { useStellarTransactionPoller } from "~/features/stellarHooks/useStellarTransactionPoller";
import { useAccount } from "~/lib/hooks";
import { useStellarKit } from "~/lib/providers/StellarWalletKitProvider";
import { trpc } from "~/lib/trpc";
import { STELLAR_NETWORK_PASSPHRASE } from "~/server/routers/stellar/utils/config";

/**
 * Parameters for registering a canonical token on Stellar.
 */
export type RegisterCanonicalTokenOnStellarParams = {
  tokenAddress: string;
  destinationChains: string[];
  gasValues: bigint[];
  onStatusUpdate?: (status: DeployAndRegisterTransactionState) => void;
};

export type RegisterCanonicalTokenOnStellarResult = {
  hash: string;
  status: string;
  tokenManagerAddress: string;
  tokenManagerType: "lock_unlock"; // Fixed as lock_unlock for canonical tokens
  deploymentMessageId?: string;
};

/**
 * Hook to register a canonical token on Stellar and deploy it to remote chains via ITS.
 *
 * This hook prepares and executes a transaction that:
 * 1. Registers an existing Stellar token with the Interchain Token Service (ITS).
 * 2. Deploys the interchain token representation to the specified `destinationChains`.
 *
 * @returns An object containing:
 *  - `registerCanonicalToken`: An async function to trigger the registration process.
 *  - `isConnected`: Whether a Stellar wallet is connected.
 */
export default function useRegisterCanonicalTokenOnStellar() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<RegisterCanonicalTokenOnStellarResult | null>(null);
  
  const { kit } = useStellarKit();
  const { address: publicKey } = useAccount();
  const { actions } = useCanonicalTokenDeploymentStateContainer();
  const { pollTransaction } = useStellarTransactionPoller();
  
  const { mutateAsync: getRegisterCanonicalTokenTxBytes } =
    trpc.stellar.getRegisterCanonicalTokenTxBytes.useMutation();
  
  const rpcUrl = stellarChainConfig.rpcUrls.default.http[0];
  const server = new rpc.Server(rpcUrl);

  const registerCanonicalToken = async ({
    tokenAddress,
    destinationChains,
    gasValues,
    onStatusUpdate,
  }: RegisterCanonicalTokenOnStellarParams): Promise<RegisterCanonicalTokenOnStellarResult> => {
    if (!kit) {
      throw new Error("Wallet not connected");
    }
    
    if (!publicKey) {
      throw new Error("Failed to get Stellar wallet public key");
    }

    setIsLoading(true);
    setError(null);
    
    try {
      // Set initial state before starting
      actions.setTxState({ type: "pending_approval" });
      onStatusUpdate?.({ 
        type: "pending_approval",
        step: 1,
        totalSteps: destinationChains.length > 0 ? 2 : 1,
      });
      
      // Get transaction bytes for canonical token registration
      const { transactionXDR } = await getRegisterCanonicalTokenTxBytes({
        caller: publicKey,
        tokenAddress,
        destinationChainIds: destinationChains,
        gasValues: gasValues.map((v) => v.toString()),
      });
      
      // Sign the transaction
      const { signedTxXdr } = await kit.signTransaction(transactionXDR, {
        networkPassphrase: STELLAR_NETWORK_PASSPHRASE,
      });
      
      // Submit the transaction
      const tx = new Transaction(signedTxXdr, STELLAR_NETWORK_PASSPHRASE);
      
      // Get the transaction hash before sending it (will be used as GMP ID)
      const txHash = tx.hash().toString("hex");
      
      onStatusUpdate?.({
        type: "deploying",
        txHash: txHash,
      });
      
      const response = await server.sendTransaction(tx);
      
      // Check if the transaction was accepted for processing
      if (
        response.status === "ERROR" ||
        response.status === "DUPLICATE" ||
        response.status === "TRY_AGAIN_LATER"
      ) {
        const errorMessage = `Stellar canonical token registration failed with status: ${response.status}. Error: ${JSON.stringify(response.errorResult)}`;
        throw new Error(errorMessage);
      }
      
      // Poll to check the transaction status
      const pollingResult = await pollTransaction(server, txHash, {
        onStatusUpdate: (status) => {
          if (status.type === "polling") {
            onStatusUpdate?.({
              type: "deploying",
              txHash: txHash,
            });
          }
        },
      });
      
      if (pollingResult.status !== "SUCCESS") {
        throw pollingResult.error;
      }
      
      // Transaction was successful
      const result: RegisterCanonicalTokenOnStellarResult = {
        hash: txHash,
        status: "SUCCESS",
        tokenManagerAddress: tokenAddress, // Using tokenAddress as tokenManagerAddress
        tokenManagerType: "lock_unlock", // Default type for canonical tokens
        deploymentMessageId: destinationChains.length > 0 ? `${txHash}-0` : undefined,
      };
      
      setData(result);
      return result;
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      setError(err);
      actions.setTxState({
        type: "idle",
      });
      onStatusUpdate?.({ type: "idle" });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    registerCanonicalToken,
    isConnected: !!kit && !!publicKey,
    isLoading,
    error,
    data,
  };
}
