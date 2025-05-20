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
import { DeployAndRegisterTransactionState } from "~/features/InterchainTokenDeployment";
import {
  TOKEN_MANAGER_TYPES,
  TokenManagerType,
} from "~/lib/drizzle/schema/common";
import { STELLAR_ITS_CONTRACT_ID } from "./config";
import {
  multicall_deploy_remote_interchain_tokens,
  type MulticallDeployRemoteResult,
} from "./remoteTokenDeployments";
import {
  createContractTransaction,
  fetchStellarAccount,
  hexToScVal,
  tokenMetadataToScVal,
} from "./transactions";

export interface DeployAndRegisterInterchainTokenResult {
  hash: string; // Base deployment hash
  status: string;
  tokenId: string;
  tokenAddress: string;
  tokenManagerAddress: string;
  tokenManagerType: string;
  remote?: MulticallDeployRemoteResult;
}

function addressToScVal(addressString: string): xdr.ScVal {
  return nativeToScVal(Address.fromString(addressString), { type: "address" });
}

/**
 * Constrói a transação para deploy de um token interchain na Stellar sem executá-la.
 * Retorna o XDR da transação que pode ser assinada e enviada pelo cliente.
 */
export async function buildDeployInterchainTokenTransaction({
  caller,
  tokenName,
  tokenSymbol,
  decimals,
  initialSupply,
  salt,
  minterAddress,
  rpcUrl,
  networkPassphrase,
}: {
  caller: string;
  tokenName: string;
  tokenSymbol: string;
  decimals: number;
  initialSupply: string | bigint;
  salt: string;
  minterAddress?: string;
  rpcUrl?: string;
  networkPassphrase?: string;
}): Promise<{ transactionXDR: string }> {
  const actualMinterAddress = minterAddress || caller;
  const actualRpcUrl = rpcUrl || stellarChainConfig.rpcUrls.default.http[0];
  const actualNetworkPassphrase = networkPassphrase || NEXT_PUBLIC_STELLAR_NETWORK_PASSPHRASE;
  
  const account = await fetchStellarAccount(caller);

  const args: xdr.ScVal[] = [
    addressToScVal(caller),
    hexToScVal(salt),
    tokenMetadataToScVal(decimals, tokenName, tokenSymbol),
    nativeToScVal(initialSupply.toString(), { type: "i128" }),
    addressToScVal(actualMinterAddress),
  ];

  return createContractTransaction({
    contractAddress: STELLAR_ITS_CONTRACT_ID,
    method: "deploy_interchain_token",
    account,
    args,
    rpcUrl: actualRpcUrl,
    networkPassphrase: actualNetworkPassphrase,
  });
}

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
  onStatusUpdate,
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
  onStatusUpdate?: (status: DeployAndRegisterTransactionState) => void;
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
    const multicallContractAddress =
      "CC6BXRCUQFAJ64NDLEZCS4FDL6GN65FL2KDOKCRHFWPMPKRWQNBA4YR2";
    const gasTokenAddress =
      "CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC";
    const networkPassphrase = "Test SDF Network ; September 2015";
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
      contractAddress: STELLAR_ITS_CONTRACT_ID,
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
      totalSteps: 2,
    });

    const tx = new Transaction(
      signedTxXdr,
      NEXT_PUBLIC_STELLAR_NETWORK_PASSPHRASE
    );
    const initialResponse = await server.sendTransaction(tx);

    if (initialResponse.status === "PENDING") {
      console.log("[STATUS_UPDATE] Deploying - Hash:", initialResponse.hash);
      onStatusUpdate?.({
        type: "deploying",
        txHash: initialResponse.hash,
      });
    }

    console.log("Initial submission response:", initialResponse);

    if (
      initialResponse.status === "ERROR" ||
      initialResponse.status === "DUPLICATE" ||
      initialResponse.status === "TRY_AGAIN_LATER"
    ) {
      const errorMessage = `Stellar transaction submission failed with status: ${initialResponse.status}. Error: ${JSON.stringify(initialResponse.errorResult)}`;
      console.error(errorMessage, initialResponse);
      throw new Error(errorMessage);
    }

    console.log("Transaction PENDING, starting polling...");
    let getTxResponse: rpc.Api.GetTransactionResponse | undefined;
    const maxPollingAttempts = 20;
    const pollingIntervalMs = 3000;

    for (let i = 0; i < maxPollingAttempts; i++) {
      await new Promise((resolve) => setTimeout(resolve, pollingIntervalMs));

      try {
        getTxResponse = await server.getTransaction(initialResponse.hash);
        console.log(
          `Polling attempt ${i + 1}: Status = ${getTxResponse.status}`
        );

        if (getTxResponse.status === rpc.Api.GetTransactionStatus.SUCCESS) {
          console.log("Transaction SUCCESS:", getTxResponse);
          break;
        } else if (
          getTxResponse.status === rpc.Api.GetTransactionStatus.FAILED
        ) {
          const failReason = `Transaction failed on-chain. Result XDR (base64): ${getTxResponse.resultXdr ? getTxResponse.resultXdr.toXDR("base64") : "N/A"}`;
          console.error("Transaction FAILED:", failReason, getTxResponse);
          throw new Error(failReason);
        } else if (
          getTxResponse.status === rpc.Api.GetTransactionStatus.NOT_FOUND
        ) {
          console.log("Transaction NOT_FOUND, continuing polling...");
        }
      } catch (pollingError) {
        console.error(
          `Error during getTransactionStatus polling:`,
          pollingError
        );
        throw new Error(
          `Polling with getTransaction failed: ${pollingError instanceof Error ? pollingError.message : String(pollingError)}`
        );
      }
    }
    if (
      !getTxResponse ||
      getTxResponse.status !== rpc.Api.GetTransactionStatus.SUCCESS
    ) {
      throw new Error(
        `Transaction did not succeed after ${maxPollingAttempts} polling attempts. Last status: ${getTxResponse?.status ?? "unknown"}`
      );
    }

    let tokenId: string | undefined;
    let tokenAddress: string | undefined;
    let tokenManagerAddress: string | undefined;
    let tokenManagerType: number | undefined;

    if (getTxResponse.resultMetaXdr) {
      try {
        const transactionMeta = getTxResponse.resultMetaXdr;
        const returnValue = transactionMeta.v3()?.sorobanMeta()?.returnValue();

        if (returnValue) {
          console.log("Parsing returnValue from resultMetaXdr:", returnValue);
          if (returnValue.switch() === xdr.ScValType.scvBytes()) {
            tokenId = returnValue.bytes().toString("hex");
            console.log("Parsed tokenId from SUCCESS resultMetaXdr:", tokenId);
          } else {
            console.warn(
              "Success returnValue parsed, but was not ScVal.Bytes as expected for tokenId.",
              returnValue.switch().name
            );
          }
        } else {
          console.warn(
            "Could not extract Soroban returnValue from resultMetaXdr."
          );
        }

        try {
          const sorobanMeta = transactionMeta.v3()?.sorobanMeta();
          const events = sorobanMeta?.events();

          if (events) {
            console.log(`Found ${events.length} events to parse.`);
            const itsContractAddressScVal = addressToScVal(
              STELLAR_ITS_CONTRACT_ID
            );
            const itsContractId = itsContractAddressScVal
              .address()
              .contractId();

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

              if (
                eventName === "interchain_token_deployed" &&
                eventTopics.length >= 3
              ) {
                const topic1 = eventTopics[1]; // tokenId (bytes)
                const topic2 = eventTopics[2]; // tokenAddress (address)

                // Extract tokenId (verify or assign)
                if (topic1 && topic1.switch() === xdr.ScValType.scvBytes()) {
                  const eventTokenId = topic1.bytes().toString("hex");
                  console.log(
                    `Found tokenId ${eventTokenId} in interchain_token_deployed`
                  );
                  if (tokenId && eventTokenId !== tokenId) {
                    console.warn(
                      "TokenID from event differs from returnValue!"
                    );
                  } else if (!tokenId) {
                    tokenId = eventTokenId;
                  }
                }

                // Extract tokenAddress
                if (
                  !tokenAddress &&
                  topic2 &&
                  topic2.switch() === xdr.ScValType.scvAddress()
                ) {
                  tokenAddress = scValToNative(topic2);
                  console.log(
                    `Found tokenAddress ${tokenAddress} in interchain_token_deployed`
                  );
                }
              } else if (
                eventName === "token_manager_deployed" &&
                eventTopics.length >= 5
              ) {
                const topic3 = eventTopics[3]; // tokenManagerAddress (address)
                const topic4 = eventTopics[4]; // tokenManagerType (u32)

                // Extract tokenManagerAddress
                if (
                  !tokenManagerAddress &&
                  topic3 &&
                  topic3.switch() === xdr.ScValType.scvAddress()
                ) {
                  tokenManagerAddress = scValToNative(topic3);
                  console.log(
                    `Found tokenManagerAddress ${tokenManagerAddress} in token_manager_deployed`
                  );
                }

                // Extract tokenManagerType
                if (
                  tokenManagerType === undefined &&
                  topic4 &&
                  topic4.switch() === xdr.ScValType.scvU32()
                ) {
                  tokenManagerType = scValToNative(topic4);
                  console.log(
                    `Found tokenManagerType ${tokenManagerType} in token_manager_deployed`
                  );
                }
              }

              if (
                tokenAddress &&
                tokenManagerAddress &&
                tokenManagerType !== undefined
              ) {
                console.log(
                  "Found all required addresses and type, stopping event processing."
                );
                break;
              }
            }
          } else {
            console.warn("No Soroban events found in transaction meta.");
          }
        } catch (parseEventError) {
          console.error(
            "Failed to parse events from resultMetaXdr:",
            parseEventError
          );
        }
      } catch (parseError) {
        console.error(
          "Failed to parse resultMetaXdr from SUCCESS response:",
          parseError
        );
      }
    } else {
      console.warn(
        "Could not find resultMetaXdr in SUCCESS transaction response."
      );
    }

    // Final checks for critical deployment information
    if (
      !tokenId ||
      !tokenAddress ||
      !tokenManagerAddress ||
      tokenManagerType === undefined
    ) {
      const missingItems: string[] = [];
      if (!tokenId) {
        console.error(
          "Failed to obtain tokenId from successful transaction result or events."
        );
        missingItems.push("tokenId");
      }
      if (!tokenAddress) {
        console.warn(
          "Failed to obtain tokenAddress from successful transaction events. This is critical."
        );
        missingItems.push("tokenAddress");
      }
      if (!tokenManagerAddress) {
        console.warn(
          "Failed to obtain tokenManagerAddress from successful transaction events. This is critical."
        );
        missingItems.push("tokenManagerAddress");
      }
      if (tokenManagerType === undefined) {
        console.warn(
          "Failed to obtain tokenManagerType from successful transaction events. This is critical."
        );
        missingItems.push("tokenManagerType");
      }

      throw new Error(
        `Failed to obtain critical information from Stellar transaction events. Missing: ${missingItems.join(", ")}.`
      );
    }

    const tokenManagerTypeString = TOKEN_MANAGER_TYPES[
      tokenManagerType
    ] as TokenManagerType;
    if (tokenManagerTypeString !== "mint_burn") {
      throw new Error(
        "tokenManagerType for native ITS token is not type 0 - mint_burn"
      );
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
    let remoteDeployResultData: MulticallDeployRemoteResult | undefined =
      undefined;

    if (
      destinationChainIds &&
      destinationChainIds.length > 0 &&
      multicallContractAddress &&
      gasTokenAddress // Ensure essential multicall params are present
    ) {
      console.log(
        "Base Stellar deployment successful. Proceeding to multicall remote deployments..."
      );
      try {
        const saltForRemote = salt;
        const rpcUrl = stellarChainConfig.rpcUrls.default.http[0];

        remoteDeployResultData =
          await multicall_deploy_remote_interchain_tokens({
            caller,
            kit,
            salt: saltForRemote,
            destinationChainIds,
            gasValues,
            itsContractAddress: STELLAR_ITS_CONTRACT_ID,
            multicallContractAddress,
            gasTokenAddress,
            rpcUrl,
            networkPassphrase,
            minterAddress: minterAddress || caller,
            onStatusUpdate: onStatusUpdate,
          });
        console.log(
          "Multicall remote deployments completed:",
          remoteDeployResultData
        );
      } catch (multicallError) {
        console.error(
          "Multicall for remote deployments failed:",
          multicallError
        );
        onStatusUpdate?.({ type: "idle" });
        throw multicallError;
      }
    }

    return {
      ...baseDeploymentResult,
      hash: remoteDeployResultData?.hash || baseDeploymentResult.hash,
    };
  } catch (error) {
    console.error("deploy_interchain_token_stellar failed:", error);
    throw error;
  }
}
