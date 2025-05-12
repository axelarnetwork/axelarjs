import type { StellarWalletsKit } from "@creit.tech/stellar-wallets-kit";
import {
  Address,
  nativeToScVal,
  rpc,
  Transaction,
  xdr,
} from "@stellar/stellar-sdk";

import { stellarChainConfig } from "~/config/chains"; 
import { NEXT_PUBLIC_STELLAR_NETWORK_PASSPHRASE } from "~/config/env"; 
import {
  createContractTransaction,
  fetchStellarAccount,
  INTERCHAIN_TOKEN_SERVICE_CONTRACT, 
  tokenMetadataToScVal, 
  hexToScVal,
} from "./transactions";

// --- Replicated Helpers (similar to index.ts / previous versions) ---

function addressToScVal(addressString: string): xdr.ScVal {
  return nativeToScVal(Address.fromString(addressString), { type: "address" });
}

// --- Deployment Function ---

export async function deploy_interchain_token_stellar({
  caller,
  kit,
  tokenName,
  tokenSymbol,
  decimals,
  initialSupply,
  salt, 
  minterAddress,
  destinationChainIds,
  gasValues,
}: {
  caller: string;
  kit: StellarWalletsKit;
  tokenName: string;
  tokenSymbol: string;
  decimals: number;
  initialSupply: bigint;
  salt: string;
  minterAddress?: string;
  destinationChainIds: string[];
  gasValues: bigint[];
}) {
  console.log("Starting deploy_interchain_token_stellar with params:", {
    caller,
    tokenName,
    tokenSymbol,
    decimals,
    initialSupply: initialSupply.toString(),
    salt,
    minterAddress,
    destinationChainIds,
    gasValues: gasValues.map((g) => g.toString()),
  });
  try {
    const rpcUrl = stellarChainConfig.rpcUrls.default.http[0];
    const server = new rpc.Server(rpcUrl, {
      allowHttp: rpcUrl.startsWith("http://"), 
    });

    const account = await fetchStellarAccount(caller);
    console.log("Fetched account sequence:", account.sequenceNumber());

    const actualMinterAddress = minterAddress || caller;

    const args: xdr.ScVal[] = [
      addressToScVal(caller),
      hexToScVal(salt),
      tokenMetadataToScVal(decimals, tokenName, tokenSymbol), 
      nativeToScVal(initialSupply.toString(), { type: "i128" }),
      addressToScVal(actualMinterAddress), 
    ];

    const { transactionXDR } = await createContractTransaction({
      contractAddress: INTERCHAIN_TOKEN_SERVICE_CONTRACT,
      method: "deploy_interchain_token",
      account,
      args,
      rpcUrl: rpcUrl,
      networkPassphrase: NEXT_PUBLIC_STELLAR_NETWORK_PASSPHRASE,
    });

    console.log("Base Transaction XDR generated:", transactionXDR);

    console.log("Requesting signature from wallet...");
    const { signedTxXdr } = await kit.signTransaction(transactionXDR, {
      networkPassphrase: NEXT_PUBLIC_STELLAR_NETWORK_PASSPHRASE,
    });

    console.log("Transaction signed:", signedTxXdr);

    console.log("Submitting transaction...");
    const tx = new Transaction(
      signedTxXdr,
      NEXT_PUBLIC_STELLAR_NETWORK_PASSPHRASE
    );
    const initialResponse = await server.sendTransaction(tx);

    console.log("Initial submission response:", initialResponse);

    // Handle immediate errors from sendTransaction
    if (initialResponse.status === "ERROR" || initialResponse.status === "DUPLICATE" || initialResponse.status === "TRY_AGAIN_LATER") {
      const errorMessage = `Stellar transaction submission failed with status: ${initialResponse.status}. Error: ${JSON.stringify(initialResponse.errorResult)}`; 
      console.error(errorMessage, initialResponse); 
      throw new Error(errorMessage);
    }

    // At this point, initialResponse.status must be PENDING.

    console.log("Transaction PENDING, starting polling...");
    let getTxResponse: rpc.Api.GetTransactionResponse | undefined;
    const maxPollingAttempts = 20; // e.g., 20 attempts * 3 seconds = 1 minute timeout
    const pollingIntervalMs = 3000; // 3 seconds

    for (let i = 0; i < maxPollingAttempts; i++) {
      await new Promise(resolve => setTimeout(resolve, pollingIntervalMs));

      try {
        // Use getTransaction for polling
        getTxResponse = await server.getTransaction(initialResponse.hash);
        console.log(`Polling attempt ${i + 1}: Status = ${getTxResponse.status}`);

        if (getTxResponse.status === rpc.Api.GetTransactionStatus.SUCCESS) {
          console.log("Transaction SUCCESS:", getTxResponse);
          break; // Exit loop on success
        } else if (getTxResponse.status === rpc.Api.GetTransactionStatus.FAILED) {
          const failReason = `Transaction failed on-chain. Result XDR (base64): ${getTxResponse.resultXdr ? getTxResponse.resultXdr.toXDR("base64") : 'N/A'}`;
          console.error("Transaction FAILED:", failReason, getTxResponse);
          throw new Error(failReason);
        } else if (getTxResponse.status === rpc.Api.GetTransactionStatus.NOT_FOUND) {
          // Can happen if the node hasn't seen it yet, continue polling
          console.log("Transaction NOT_FOUND, continuing polling...");
        }
        // If status is still UNKNOWN or PENDING? (getTransaction might not return PENDING)
        // Continue loop

      } catch (pollingError) {
        console.error(`Error during getTransactionStatus polling:`, pollingError);
        // Decide if we should retry or throw. Let's throw for now.
        throw new Error(`Polling with getTransaction failed: ${pollingError instanceof Error ? pollingError.message : String(pollingError)}`);
      }
    }

    // After loop, check final status
    if (!getTxResponse || getTxResponse.status !== rpc.Api.GetTransactionStatus.SUCCESS) {
      throw new Error(`Transaction did not succeed after ${maxPollingAttempts} polling attempts. Last status: ${getTxResponse?.status ?? 'unknown'}`);
    }

    // --- Parse tokenId from SUCCESS response --- 
    let tokenId: string | undefined;

    if (getTxResponse.resultMetaXdr) {
      try {
        // resultMetaXdr is already an xdr.TransactionMeta object
        const transactionMeta = getTxResponse.resultMetaXdr;
        const returnValue = transactionMeta.v3()?.sorobanMeta()?.returnValue();

        if (returnValue) {
          console.log("Parsing returnValue from resultMetaXdr:", returnValue);
          // Assuming the returned ScVal is of type Bytes containing the tokenId
          if (returnValue.switch() === xdr.ScValType.scvBytes()) {
            tokenId = returnValue.bytes().toString("hex");
          console.log("Parsed tokenId from SUCCESS resultMetaXdr:", tokenId);
          } else {
            console.warn("Success returnValue parsed, but was not ScVal.Bytes as expected for tokenId.", returnValue.switch().name);
          }
        } else {
          console.warn("Could not extract Soroban returnValue from resultMetaXdr.");
        }
      } catch (parseError) {
        console.error("Failed to parse resultMetaXdr from SUCCESS response:", parseError);
      } 
    } else { // Start of else block for if (getTxResponse.resultMetaXdr)
      console.warn("Could not find resultMetaXdr in SUCCESS transaction response.");
    }

    console.log("tokenId", tokenId);
    if (!tokenId) {
      // Fallback or error if tokenId couldn't be parsed even after success
      console.error("Failed to obtain tokenId from successful transaction result.");
      throw new Error("Failed to obtain tokenId from successful Stellar transaction result.");
    }

    // Return success details
    return {
      hash: initialResponse.hash, // Use original hash
      status: "SUCCESS", // Final status
      tokenId: `0x${tokenId}`, // Return as hex string with 0x prefix
    };
  } catch (error) {
    console.error("deploy_interchain_token_stellar failed:", error);
    throw error; // Re-throw the error for the hook to catch
  }
}
