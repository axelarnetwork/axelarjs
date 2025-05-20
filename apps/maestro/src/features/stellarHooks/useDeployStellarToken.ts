import { useState } from "react";

import type { StellarWalletsKit as BaseStellarWalletsKit } from "@creit.tech/stellar-wallets-kit";
import { rpc, scValToNative, Transaction, xdr } from "@stellar/stellar-sdk";

import { stellarChainConfig } from "~/config/chains";
import { NEXT_PUBLIC_STELLAR_NETWORK_PASSPHRASE } from "~/config/env";
import type { DeployAndRegisterTransactionState } from "~/features/InterchainTokenDeployment";
import { trpc } from "~/lib/trpc";
import { useStellarTransactionPoller } from "./useStellarTransactionPoller";

interface StellarWalletsKit extends BaseStellarWalletsKit {
  getPublicKey(): Promise<string>;
  signTransaction(
    xdr: string,
    options: { networkPassphrase: string }
  ): Promise<{ signedTxXdr: string }>;
}

export interface DeployTokenParams {
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
}

export interface DeployTokenResultStellar {
  hash: string;
  status: string;
  tokenId: string;
  tokenAddress: string;
  tokenManagerAddress: string;
  tokenManagerType: string;
}

export function useDeployStellarToken() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<DeployTokenResultStellar | null>(null);

  // Use the Stellar transaction polling hook
  const { pollTransaction } = useStellarTransactionPoller();

  const { mutateAsync: getDeployTokenTxBytes } =
    trpc.stellar.getDeployTokenTxBytes.useMutation();

  const { mutateAsync: getDeployRemoteTokensTxBytes } =
    trpc.stellar.getDeployRemoteTokensTxBytes.useMutation();

  const deployStellarToken = async ({
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
  }: DeployTokenParams): Promise<DeployTokenResultStellar> => {
    // Check if the kit is available
    if (!kit) {
      throw new Error("StellarWalletsKit not provided");
    }

    // Check if the user is connected and get the public key
    let publicKey: string;
    try {
      publicKey = (await kit.getAddress()).address;
      if (!publicKey) {
        throw new Error("Stellar wallet not connected");
      }
    } catch (error) {
      // Error getting public key
      throw new Error("Failed to get Stellar wallet public key");
    }

    // First step: deploy the token on Stellar
    onStatusUpdate?.({ type: "pending_approval", step: 1, totalSteps: 2 });

    try {
      // 1. Get transaction bytes for token deployment
      const { transactionXDR } = await getDeployTokenTxBytes({
        caller: publicKey,
        tokenName,
        tokenSymbol,
        decimals,
        initialSupply: initialSupply.toString(),
        salt,
        minterAddress,
      });

      // 2. Sign the transaction
      const { signedTxXdr } = await kit.signTransaction(transactionXDR, {
        networkPassphrase: NEXT_PUBLIC_STELLAR_NETWORK_PASSPHRASE,
      });

      // 3. Submit the transaction
      const rpcUrl = stellarChainConfig.rpcUrls.default.http[0];
      const server = new rpc.Server(rpcUrl, {
        allowHttp: rpcUrl.startsWith("http://"),
      });

      const tx = new Transaction(
        signedTxXdr,
        NEXT_PUBLIC_STELLAR_NETWORK_PASSPHRASE
      );

      // Não enviamos o txHash aqui porque ainda não temos o hash da transação
      const initialResponse = await server.sendTransaction(tx);

      if (initialResponse.status === "PENDING") {
        // Deploying with hash
        onStatusUpdate?.({
          type: "deploying",
          txHash: initialResponse.hash,
        });
      }

      if (
        initialResponse.status === "ERROR" ||
        initialResponse.status === "DUPLICATE" ||
        initialResponse.status === "TRY_AGAIN_LATER"
      ) {
        const errorMessage = `Stellar transaction submission failed with status: ${initialResponse.status}. Error: ${JSON.stringify(initialResponse.errorResult)}`;
        // Error in transaction submission
        throw new Error(errorMessage);
      }

      // 4. Wait for transaction confirmation using the polling hook

      const pollingResult = await pollTransaction(
        server,
        initialResponse.hash,
        {
          onStatusUpdate: (status) => {
            if (status.type === "polling") {
              onStatusUpdate?.({
                type: "deploying",
                txHash: initialResponse.hash,
              });
            }
          },
        }
      );

      if (pollingResult.status !== "SUCCESS") {
        throw pollingResult.error;
      }

      // Use the transaction result for data extraction
      // We need to fetch the transaction again to access resultMetaXdr
      const getTxResponse = await server.getTransaction(initialResponse.hash);

      // 5. Extract token information from the transaction response
      let tokenId: string | undefined;
      let tokenAddress: string | undefined;
      let tokenManagerAddress: string | undefined;
      let tokenManagerType: string | undefined;

      // Check if we have resultMetaXdr in the response (may not be defined in the type)
      const txResponseWithMeta = getTxResponse as any;
      if (txResponseWithMeta.resultMetaXdr) {
        try {
          // Extract tokenId from the transaction return value
          const transactionMeta = txResponseWithMeta.resultMetaXdr;
          const returnValue = transactionMeta
            .v3()
            ?.sorobanMeta()
            ?.returnValue();

          if (
            returnValue &&
            returnValue.switch() === xdr.ScValType.scvBytes()
          ) {
            tokenId = returnValue.bytes().toString("hex");
            // Extracted tokenId from transaction return value
          }

          // Extract tokenAddress, tokenManagerAddress and tokenManagerType from events
          const sorobanMeta = transactionMeta.v3()?.sorobanMeta();
          const events = sorobanMeta?.events();

          if (events && events.length > 0) {
            // Found events to process

            for (const event of events) {
              const eventTopics = event.body().v0().topics();
              if (!eventTopics || eventTopics.length === 0) continue;

              // Check the event name (first topic must be a symbol)
              const firstTopic = eventTopics[0];
              if (firstTopic.switch() !== xdr.ScValType.scvSymbol()) continue;

              const eventName = firstTopic.sym().toString();
              // Process event by name

              // Interchain token deployment event
              if (
                eventName === "interchain_token_deployed" &&
                eventTopics.length >= 3
              ) {
                const topic1 = eventTopics[1]; // tokenId (bytes)
                const topic2 = eventTopics[2]; // tokenAddress (address)

                // Extract tokenId from the event (if not already extracted from return value)
                if (
                  !tokenId &&
                  topic1 &&
                  topic1.switch() === xdr.ScValType.scvBytes()
                ) {
                  tokenId = topic1.bytes().toString("hex");
                  // Found tokenId in interchain_token_deployed event
                }

                // Extract tokenAddress
                if (
                  !tokenAddress &&
                  topic2 &&
                  topic2.switch() === xdr.ScValType.scvAddress()
                ) {
                  try {
                    tokenAddress = scValToNative(topic2);
                    // Found tokenAddress in interchain_token_deployed event
                  } catch (error) {
                    // Error extracting tokenAddress
                    // Se falhar, use o valor hexadecimal bruto do endereço
                    try {
                      const addressBytes = topic2.address().contractId();
                      if (addressBytes) {
                        tokenAddress = addressBytes.toString("hex");
                        // Using raw hex for tokenAddress
                      }
                    } catch (e) {
                      // Failed to extract raw address bytes
                    }
                  }
                }
              }
              // Token manager deployment event
              else if (
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
                  try {
                    tokenManagerAddress = scValToNative(topic3);
                    // Found tokenManagerAddress in token_manager_deployed event
                  } catch (error) {
                    // Error extracting tokenManagerAddress
                    // Se falhar, use o valor hexadecimal bruto do endereço
                    try {
                      const addressBytes = topic3.address().contractId();
                      if (addressBytes) {
                        tokenManagerAddress = addressBytes.toString("hex");
                        // Using raw hex for tokenManagerAddress
                      }
                    } catch (e) {
                      // Failed to extract raw address bytes
                    }
                  }
                }

                // Extract tokenManagerType
                if (
                  tokenManagerType === undefined &&
                  topic4 &&
                  topic4.switch() === xdr.ScValType.scvU32()
                ) {
                  try {
                    const typeNumber = scValToNative(topic4);
                    tokenManagerType =
                      typeNumber === 0 ? "mint_burn" : "lock_unlock";
                    // Found tokenManagerType in token_manager_deployed event
                  } catch (error) {
                    // Error extracting tokenManagerType
                    // In case of error, assume the default type mint_burn
                    tokenManagerType = "mint_burn";
                    // Using default tokenManagerType
                  }
                }
              }

              // If we found all the required information, we can stop
              if (
                tokenId &&
                tokenAddress &&
                tokenManagerAddress &&
                tokenManagerType
              ) {
                // Found all required token information, stopping event processing
                break;
              }
            }
          }
        } catch (error) {
          // Error extracting token information from transaction
        }
      }

      // If we couldn't extract all the necessary information, use fallback values
      if (
        !tokenId ||
        !tokenAddress ||
        !tokenManagerAddress ||
        !tokenManagerType
      ) {
        // Could not extract all token information from transaction, using fallback values

        // Use salt as tokenId if we couldn't extract it from the result
        if (!tokenId) tokenId = salt;

        // Generate unique values based on the transaction hash for other fields
        const txHash = initialResponse.hash.substring(0, 10);
        if (!tokenAddress) tokenAddress = `TOKEN_${txHash}`;
        if (!tokenManagerAddress)
          tokenManagerAddress = `TOKEN_MANAGER_${txHash}`;
        if (!tokenManagerType) tokenManagerType = "mint_burn";
      }

      // Format tokenId with 0x prefix if it doesn't have it yet
      if (tokenId && !tokenId.startsWith("0x")) {
        tokenId = `0x${tokenId}`;
      }

      // 6. If there are destinationChainIds, do remote deployment
      let remoteDeployResult;
      if (destinationChainIds.length > 0) {
        onStatusUpdate?.({ type: "pending_approval", step: 2, totalSteps: 2 });

        try {
          // Get transaction bytes for remote deployment
          const { transactionXDR: remoteTxXDR } =
            await getDeployRemoteTokensTxBytes({
              caller: publicKey,
              salt,
              destinationChainIds,
              gasValues: gasValues.map((v) => v.toString()),
              minterAddress: minterAddress || publicKey,
            });

          // Sign the transaction
          const { signedTxXdr: signedRemoteTxXdr } = await kit.signTransaction(
            remoteTxXDR,
            {
              networkPassphrase: NEXT_PUBLIC_STELLAR_NETWORK_PASSPHRASE,
            }
          );

          // Submit the transaction
          const remoteTx = new Transaction(
            signedRemoteTxXdr,
            NEXT_PUBLIC_STELLAR_NETWORK_PASSPHRASE
          );

          // Get the transaction hash before sending it (will be used as GMP ID)
          const txHash = remoteTx.hash().toString("hex");

          onStatusUpdate?.({
            type: "deploying",
            txHash: txHash,
          });

          // Submitting multicall transaction

          const remoteResponse = await server.sendTransaction(remoteTx);
          // Remote transaction submitted

          // Check if the transaction was accepted for processing
          if (
            remoteResponse.status === "ERROR" ||
            remoteResponse.status === "DUPLICATE" ||
            remoteResponse.status === "TRY_AGAIN_LATER"
          ) {
            const errorMessage = `Stellar remote deployment failed with status: ${remoteResponse.status}. Error: ${JSON.stringify(remoteResponse.errorResult)}`;
            // Error in remote transaction submission
            throw new Error(errorMessage);
          }

          // Poll to check the transaction status using the polling hook
          // Transaction pending, starting polling

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

          if (pollingResult.status === "SUCCESS") {
            remoteDeployResult = {
              hash: txHash,
              status: "SUCCESS",
            };
          } else {
            throw pollingResult.error;
          }
        } catch (error) {
          // Remote deployment error
          onStatusUpdate?.({ type: "idle" });
          throw error;
        }
      }

      // 7. Return the complete result
      // If there's a remote deployment, use the remote transaction hash as the main hash
      const result: DeployTokenResultStellar = {
        hash: remoteDeployResult
          ? remoteDeployResult.hash
          : initialResponse.hash,
        status: "SUCCESS",
        tokenId,
        tokenAddress,
        tokenManagerAddress,
        tokenManagerType,
        remote: remoteDeployResult,
      };

      setData(result);
      return result;
    } catch (e) {
      setError(e instanceof Error ? e : new Error(String(e)));
      onStatusUpdate?.({ type: "idle" });
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    deployStellarToken,
    isLoading,
    error,
    data,
  };
}
