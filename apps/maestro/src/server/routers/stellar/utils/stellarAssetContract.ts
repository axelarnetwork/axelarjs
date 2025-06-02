import { Asset, BASE_FEE, Operation, TransactionBuilder } from "stellar-sdk";
import { rpc } from "stellar-sdk";

import { fetchStellarAccount } from "./transactions";
import { STELLAR_NETWORK_PASSPHRASE, STELLAR_RPC_URL } from "./config";
import { checkIfTokenContractExists } from "./transactions";

/**
 * Creates a transaction to deploy a Stellar Asset Contract for a given asset
 * @param caller The address of the caller
 * @param assetCode The code of the asset (e.g., "USDC")
 * @param issuer The issuer of the asset
 * @returns The XDR of the transaction that can be signed and sent by the client
 */
export async function createStellarAssetContractTransaction({
  caller,
  assetCode,
  issuer,
}: {
  caller: string;
  assetCode: string;
  issuer: string;
}): Promise<{
  transactionXDR: string;
  contractId: string;
  exists: boolean;
}> {
  // Create the asset
  const asset = new Asset(assetCode, issuer);
  
  // Get the contract ID
  const contractId = asset.contractId(STELLAR_NETWORK_PASSPHRASE);
  
  // Check if the contract already exists
  const exists = await checkIfTokenContractExists(contractId);
  
  // If the contract already exists, return early
  if (exists) {
    return {
      transactionXDR: "",
      contractId,
      exists: true,
    };
  }
  
  // Get the account
  const account = await fetchStellarAccount(caller);
  
  // Create RPC server instance for preparing the transaction
  const server = new rpc.Server(STELLAR_RPC_URL, {
    allowHttp: STELLAR_RPC_URL.includes("localhost") || STELLAR_RPC_URL.includes("127.0.0.1"),
  });
  
  // Build the transaction
  const txBuilder = new TransactionBuilder(account, {
    fee: BASE_FEE,
    networkPassphrase: STELLAR_NETWORK_PASSPHRASE,
  });
  
  // Add the operation to create the Stellar Asset Contract
  txBuilder.addOperation(
    Operation.createStellarAssetContract({
      asset: asset,
    })
  );
  
  const builtTransaction = txBuilder.setTimeout(0).build();
  
  // Prepare the transaction (simulate and discover storage footprint)
  try {
    const preparedTransaction = await server.prepareTransaction(builtTransaction);
    const transactionXDR = preparedTransaction.toXDR();
    
    return {
      transactionXDR,
      contractId,
      exists: false,
    };
  } catch (error) {
    console.error("Error preparing transaction:", error);
    throw error;
  }
}
