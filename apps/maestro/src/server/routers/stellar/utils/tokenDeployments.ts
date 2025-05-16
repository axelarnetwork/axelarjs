import type { StellarWalletsKit } from "@creit.tech/stellar-wallets-kit";
import {
  Address,
  nativeToScVal,
  rpc,
  scValToNative,
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
import { TOKEN_MANAGER_TYPES, TokenManagerType } from "~/lib/drizzle/schema/common";
import { DeployAndRegisterTransactionState } from "~/features/InterchainTokenDeployment";
import {
  multicall_deploy_remote_interchain_tokens,
  type MulticallDeployRemoteStatus, // Assuming this type is exported from remoteTokenDeployments.ts
  type MulticallDeployRemoteResult // Assuming this type is exported for the return value
} from "./remoteTokenDeployments";

// --- Replicated Helpers (similar to index.ts / previous versions) ---

// New result type combining base and optional remote deployment results
export interface DeployAndRegisterInterchainTokenResult {
  hash: string; // Base deployment hash
  status: string; // Base deployment status ("SUCCESS", "ERROR")
  tokenId: string;
  tokenAddress: string;
  tokenManagerAddress: string;
  tokenManagerType: string; // e.g., "mint_burn"
  remote?: MulticallDeployRemoteResult; // Optional: result from remote multicall deployment
}

// --- Old orchestrator types removed ---

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
  destinationChainIds, // Used for multicall if multicallContractAddress & gasTokenAddress are provided
  gasValues,           // Used for multicall
  onStatusUpdate,      // For base deployment status
  // New optional params for multicall remote deployments:
  remoteSalt,
  onMulticallStatusUpdate,
}: {
  caller: string;
  kit: StellarWalletsKit;
  tokenName: string;
  tokenSymbol: string;
  decimals: number;
  initialSupply: bigint;
  salt: string;
  minterAddress?: string;
  destinationChainIds: string[]; // If empty, or multicall params not provided, no remote deploy occurs
  gasValues: bigint[];
  onStatusUpdate?: (status: DeployAndRegisterTransactionState) => void; // For base deployment
  // Optional multicall parameters  gasTokenAddress?: string;
  remoteSalt?: string;             // Salt for remote deployments, defaults to base 'salt'
  onMulticallStatusUpdate?: (status: MulticallDeployRemoteStatus) => void;
}): Promise<DeployAndRegisterInterchainTokenResult> {
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
    const multicallContractAddress = "CC6BXRCUQFAJ64NDLEZCS4FDL6GN65FL2KDOKCRHFWPMPKRWQNBA4YR2";
    const gasTokenAddress = "CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC";
    const rpcUrl = stellarChainConfig.rpcUrls.default.http[0];
    const server = new rpc.Server(rpcUrl, {
      allowHttp: rpcUrl.startsWith("http://"), 
    });

    const account = await fetchStellarAccount(caller);

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

    const { signedTxXdr } = await kit.signTransaction(transactionXDR, {
      networkPassphrase: NEXT_PUBLIC_STELLAR_NETWORK_PASSPHRASE,
    });

    onStatusUpdate?.({
      type: "pending_approval",
      step: 1,
      totalSteps: 1,
    });

    const tx = new Transaction(
      signedTxXdr,
      NEXT_PUBLIC_STELLAR_NETWORK_PASSPHRASE
    );
    const initialResponse = await server.sendTransaction(tx);

    // Mudar para o estado 'deploying' com o hash real
    // Isso ocorre após a submissão inicial bem-sucedida (status PENDING)
    if (initialResponse.status === "PENDING") {
      console.log("[STATUS_UPDATE] Deploying - Hash:", initialResponse.hash);
      onStatusUpdate?.({
        type: "deploying",
        txHash: initialResponse.hash, // Usar o hash real da transação
      });
    }    

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

    // --- Parse tokenId, tokenAddress, and tokenManagerAddress from SUCCESS response --- 
    let tokenId: string | undefined;
    let tokenAddress: string | undefined;
    let tokenManagerAddress: string | undefined;
    let tokenManagerType: number | undefined;

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

        // --- Parse Events --- 
        try {
          const sorobanMeta = transactionMeta.v3()?.sorobanMeta();
          const events = sorobanMeta?.events();

          if (events) {
            console.log(`Found ${events.length} events to parse.`);
            const itsContractAddressScVal = addressToScVal(INTERCHAIN_TOKEN_SERVICE_CONTRACT);
            const itsContractId = itsContractAddressScVal.address().contractId(); // Get contract ID for comparison

            for (const event of events) {
              // Check if the event is from the correct contract
              const eventContractId = event.contractId();
              if (!(eventContractId && eventContractId.equals(itsContractId))) {
                continue; // Skip events from other contracts
              }

              const eventTopics = event.body().v0().topics();
              if (!eventTopics || eventTopics.length === 0) {
                continue; // Skip events with no topics
              }

              // Check the first topic for the event name (Symbol)
              const firstTopic = eventTopics[0];
              if (firstTopic.switch() !== xdr.ScValType.scvSymbol()) {
                continue; // Skip events where the first topic isn't a symbol
              }

              const eventName = firstTopic.sym().toString();
              console.log("Processing event:", eventName);

              if (eventName === "interchain_token_deployed" && eventTopics.length >= 3) {
                const topic1 = eventTopics[1]; // tokenId (bytes)
                const topic2 = eventTopics[2]; // tokenAddress (address)

                // Extract tokenId (verify or assign)
                if (topic1 && topic1.switch() === xdr.ScValType.scvBytes()) {
                  const eventTokenId = topic1.bytes().toString("hex");
                  console.log(`Found tokenId ${eventTokenId} in interchain_token_deployed`);
                  if (tokenId && eventTokenId !== tokenId) {
                    console.warn("TokenID from event differs from returnValue!");
                  } else if (!tokenId) {
                    tokenId = eventTokenId;
                  }
                }

                // Extract tokenAddress
                if (!tokenAddress && topic2 && topic2.switch() === xdr.ScValType.scvAddress()) {
                  tokenAddress = scValToNative(topic2);
                  console.log(`Found tokenAddress ${tokenAddress} in interchain_token_deployed`);
                }
              } else if (eventName === "token_manager_deployed" && eventTopics.length >= 5) { 
                // const topic1 = eventTopics[1]; // tokenId (bytes) - can optionally verify
                // const topic2 = eventTopics[2]; // tokenAddress (address) - can optionally verify
                const topic3 = eventTopics[3]; // tokenManagerAddress (address)
                const topic4 = eventTopics[4]; // tokenManagerType (u32)

                // Extract tokenManagerAddress
                if (!tokenManagerAddress && topic3 && topic3.switch() === xdr.ScValType.scvAddress()) {
                  tokenManagerAddress = scValToNative(topic3);
                  console.log(`Found tokenManagerAddress ${tokenManagerAddress} in token_manager_deployed`);
                }

                // Extract tokenManagerType
                if (tokenManagerType === undefined && topic4 && topic4.switch() === xdr.ScValType.scvU32()) {
                  tokenManagerType = scValToNative(topic4);
                  console.log(`Found tokenManagerType ${tokenManagerType} in token_manager_deployed`);
                }
              }

              // If we found all required data, we can stop searching
              if (tokenAddress && tokenManagerAddress && tokenManagerType !== undefined) {
                console.log("Found all required addresses and type, stopping event processing.");
                break;
              }
            }
          } else {
            console.warn("No Soroban events found in transaction meta.");
          }
        } catch (parseEventError) { 
          console.error("Failed to parse events from resultMetaXdr:", parseEventError);
          // Continue without event data if parsing fails, but log it
        }
        
      } catch (parseError) {
        console.error("Failed to parse resultMetaXdr from SUCCESS response:", parseError);
      } 
    } else { 
      console.warn("Could not find resultMetaXdr in SUCCESS transaction response.");
    }

    // Final checks
    if (!tokenId) {
      console.error("Failed to obtain tokenId from successful transaction result or events.");
      throw new Error("Failed to obtain tokenId from successful Stellar transaction result or events.");
    }
    if (!tokenAddress) {
      console.warn("Failed to obtain tokenAddress from successful transaction events.");
      // Decide if this is critical. For now, let's throw an error.
      throw new Error("Failed to obtain tokenAddress from successful Stellar transaction events.");
    }
    if (!tokenManagerAddress) {
      console.warn("Failed to obtain tokenManagerAddress from successful transaction events.");
      // Decide if this is critical. For now, let's throw an error.
      throw new Error("Failed to obtain tokenManagerAddress from successful Stellar transaction events.");
    }
    if (tokenManagerType === undefined) {
      console.warn("Failed to obtain tokenManagerType from successful transaction events.");
      // Decide if this is critical. For now, let's throw an error.
      throw new Error("Failed to obtain tokenManagerType from successful Stellar transaction events.");
    }

    const tokenManagerTypeString = TOKEN_MANAGER_TYPES[tokenManagerType] as TokenManagerType;
    if (tokenManagerTypeString !== "mint_burn") {
      throw new Error("tokenManagerType for native ITS token is not type 0 - mint_burn");
    } 
    const baseDeploymentResult = {
      hash: initialResponse.hash,
      status: "SUCCESS" as const,
      tokenId: `0x${tokenId}`,
      tokenAddress: tokenAddress,
      tokenManagerAddress: tokenManagerAddress,
      tokenManagerType: tokenManagerTypeString,
    };

    // --- Conditionally execute multicall for remote deployments ---
    let remoteDeployResultData: MulticallDeployRemoteResult | undefined = undefined;

    if (
      destinationChainIds && destinationChainIds.length > 0 &&
      multicallContractAddress && gasTokenAddress // Ensure essential multicall params are present
    ) {
      console.log("Base Stellar deployment successful. Proceeding to multicall remote deployments...");
      try {
        const saltForRemote = remoteSalt || salt; // Use specific remote salt or fallback to base salt
        const rpcUrl = stellarChainConfig.rpcUrls.default.http[0];
        const networkPassphrase = NEXT_PUBLIC_STELLAR_NETWORK_PASSPHRASE;

        if (!networkPassphrase) {
          console.error("Stellar network passphrase is not configured for multicall remote deployments.");
          onMulticallStatusUpdate?.({ type: "error", message: "Stellar network passphrase not configured for multicall."});
        } else {
          remoteDeployResultData = await multicall_deploy_remote_interchain_tokens({
            caller, 
            kit,    
            salt: saltForRemote,
            destinationChainIds,
            gasValues,
            itsContractAddress: INTERCHAIN_TOKEN_SERVICE_CONTRACT,
            multicallContractAddress,
            gasTokenAddress,
            rpcUrl,
            networkPassphrase,
            minterAddress: minterAddress || caller, 
            onStatusUpdate: onMulticallStatusUpdate,
          });
          console.log("Multicall remote deployments completed:", remoteDeployResultData);
        }
      } catch (multicallError) {
        console.error("Multicall for remote deployments failed:", multicallError);
        const errorMessage = multicallError instanceof Error ? multicallError.message : String(multicallError);
        onMulticallStatusUpdate?.({ type: "error", message: `Multicall failed: ${errorMessage}`, error: multicallError });
        // Do not re-throw here to allow returning the successful base deployment details.
        // remoteDeployResultData will remain undefined or could capture error if multicall_deploy_remote_interchain_tokens itself returns error status.
      }
    }

    return {
      ...baseDeploymentResult,
      remote: remoteDeployResultData,
    };
  } catch (error) {
    console.error("deploy_interchain_token_stellar failed:", error);
    throw error; // Re-throw the error for the hook to catch
  }
}
// --- Orchestrator function 'deployFullInterchainTokenSuite' and its example have been removed. ---
// --- The remote deployment logic is now integrated into 'deploy_interchain_token_stellar'. ---
