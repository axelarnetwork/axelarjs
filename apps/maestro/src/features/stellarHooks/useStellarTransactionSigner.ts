import { rpc, Transaction } from "@stellar/stellar-sdk";
import type { StellarWalletsKit } from "@creit.tech/stellar-wallets-kit";

import { stellarChainConfig } from "~/config/chains";
import { STELLAR_NETWORK_PASSPHRASE } from "~/server/routers/stellar/utils/config";

export interface SignAndSubmitTransactionParams<TStatusType = any> {
  kit: StellarWalletsKit;
  transactionXDR: string;
  onStatusUpdate?: (status: TStatusType) => void;
  // Function to create a deploying status update object
  createDeployingStatus?: (txHash: string) => TStatusType;
}

export interface TransactionSubmitResult {
  hash: string;
  status: string;
  errorResult?: any;
  server: rpc.Server;
}

/**
 * Hook for signing and submitting Stellar transactions
 * Extracts common functionality used across multiple Stellar transaction hooks
 */
export function useStellarTransactionSigner() {
  /**
   * Signs and submits a Stellar transaction
   * @param params The transaction parameters
   * @returns The transaction submission result
   */
  const signAndSubmitTransaction = async <TStatusType = any>({
    kit,
    transactionXDR,
    onStatusUpdate,
    createDeployingStatus,
  }: SignAndSubmitTransactionParams<TStatusType>): Promise<TransactionSubmitResult> => {
    if (!kit) {
      throw new Error("StellarWalletsKit not provided");
    }

    try {
      // Sign the transaction with the wallet
      const { signedTxXdr } = await kit.signTransaction(transactionXDR, {
        networkPassphrase: STELLAR_NETWORK_PASSPHRASE,
      });

      // Create a Transaction object from the signed XDR
      const tx = new Transaction(signedTxXdr, STELLAR_NETWORK_PASSPHRASE);
      
      // Get transaction hash
      const txHash = tx.hash().toString("hex");
      
      // Update status to deploying if onStatusUpdate and createDeployingStatus are provided
      if (onStatusUpdate && createDeployingStatus) {
        onStatusUpdate(createDeployingStatus(txHash));
      }

      // Initialize the Stellar server
      const rpcUrl = stellarChainConfig.rpcUrls.default.http[0];
      const server = new rpc.Server(rpcUrl);
      
      // Submit the transaction
      const response = await server.sendTransaction(tx);

      // Handle error states
      if (
        response.status === "ERROR" ||
        response.status === "DUPLICATE" ||
        response.status === "TRY_AGAIN_LATER"
      ) {
        const errorMessage = `Stellar transaction submission failed with status: ${response.status}. Error: ${JSON.stringify(response.errorResult)}`;
        throw new Error(errorMessage);
      }
      
      // Handle PENDING status updates
      if (response.status === "PENDING" && onStatusUpdate && createDeployingStatus) {
        onStatusUpdate(createDeployingStatus(response.hash));
      }

      return {
        hash: response.hash,
        status: response.status,
        errorResult: response.errorResult,
        server,
      };
    } catch (error) {
      console.error("Failed to sign or submit Stellar transaction:", error);
      throw error;
    }
  };

  return {
    signAndSubmitTransaction,
  };
}

export default useStellarTransactionSigner;
