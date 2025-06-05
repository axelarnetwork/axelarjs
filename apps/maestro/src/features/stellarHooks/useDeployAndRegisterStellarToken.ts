import { useState } from "react";

import type { StellarWalletsKit } from "@creit.tech/stellar-wallets-kit";
import { rpc, scValToNative, Transaction, xdr } from "@stellar/stellar-sdk";

import { stellarChainConfig } from "~/config/chains";
import type { DeployAndRegisterTransactionState } from "~/features/InterchainTokenDeployment";
import { trpc } from "~/lib/trpc";
import { STELLAR_NETWORK_PASSPHRASE } from "~/server/routers/stellar/utils/config";
import { useStellarTransactionPoller } from "./useStellarTransactionPoller";

export interface DeployAndRegisterTokenParams {
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

export interface DeployAndRegisterTokenResultStellar {
  hash: string;
  status: string;
  tokenId: string;
  tokenAddress: string;
  tokenManagerAddress: string;
  tokenManagerType: string;
}

export function useDeployAndRegisterStellarToken() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<DeployAndRegisterTokenResultStellar | null>(null);

  const { pollTransaction } = useStellarTransactionPoller();

  const { mutateAsync: getDeployAndRegisterRemoteTokenTxBytes } =
    trpc.stellar.getDeployAndRegisterRemoteTokenTxBytes.useMutation();

  const deployAndRegisterStellarToken = async ({
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
  }: DeployAndRegisterTokenParams): Promise<DeployAndRegisterTokenResultStellar> => {
    if (!kit) {
      throw new Error("StellarWalletsKit not provided");
    }

    let publicKey: string;
    try {
      publicKey = (await kit.getAddress()).address;
      if (!publicKey) {
        throw new Error("Stellar wallet not connected");
      }
    } catch (error) {
      throw new Error("Failed to get Stellar wallet public key");
    }

    // Single step: deploy and register the token on Stellar in one transaction
    onStatusUpdate?.({
      type: "pending_approval",
      step: 1,
      totalSteps: 1,
    });

    try {
      setIsLoading(true);
      
      // 1. Get transaction bytes for combined deployment and registration
      const { transactionXDR } = await getDeployAndRegisterRemoteTokenTxBytes({
        caller: publicKey,
        tokenName,
        tokenSymbol,
        decimals,
        initialSupply: initialSupply.toString(),
        salt,
        minterAddress,
        destinationChainIds,
        gasValues: gasValues.map(value => value.toString()),
      });

      // 2. Sign the transaction
      const { signedTxXdr } = await kit.signTransaction(transactionXDR, {
        networkPassphrase: STELLAR_NETWORK_PASSPHRASE,
      });

      // 3. Submit the transaction
      const rpcUrl = stellarChainConfig.rpcUrls.default.http[0];
      const server = new rpc.Server(rpcUrl);

      const tx = new Transaction(signedTxXdr, STELLAR_NETWORK_PASSPHRASE);

      const initialResponse = await server.sendTransaction(tx);

      if (initialResponse.status === "PENDING") {
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
        throw new Error(errorMessage);
      }

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
          }

          // Extract tokenAddress, tokenManagerAddress, tokenManagerType, and GMP message IDs from events
          const sorobanMeta = transactionMeta.v3()?.sorobanMeta();
          const events = sorobanMeta?.events();

          if (events && events.length > 0) {
            for (const event of events) {
              const eventTopics = event.body().v0().topics();
              if (!eventTopics || eventTopics.length === 0) continue;

              // Check the event name (first topic must be a symbol)
              const firstTopic = eventTopics[0];
              if (firstTopic.switch() !== xdr.ScValType.scvSymbol()) continue;

              const eventName = firstTopic.sym().toString();

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
                }

                // Extract tokenAddress
                if (
                  !tokenAddress &&
                  topic2 &&
                  topic2.switch() === xdr.ScValType.scvAddress()
                ) {
                  try {
                    tokenAddress = scValToNative(topic2);
                  } catch (error) {
                    try {
                      const addressBytes = topic2.address().contractId();
                      if (addressBytes) {
                        tokenAddress = addressBytes.toString("hex");
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
                  } catch (error) {
                    try {
                      const addressBytes = topic3.address().contractId();
                      if (addressBytes) {
                        tokenManagerAddress = addressBytes.toString("hex");
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
                  } catch (error) {
                    // In case of error, assume the default type mint_burn
                    tokenManagerType = "mint_burn";
                  }
                }
              }

              if (
                tokenId &&
                tokenAddress &&
                tokenManagerAddress &&
                tokenManagerType
              ) {
                break;
              }
            }
          }
        } catch (error) {
          console.error("Error extracting token information from transaction:", error);
        }
      }

      // If we couldn't extract all the necessary information, throw an error
      if (
        !tokenId ||
        !tokenAddress ||
        !tokenManagerAddress ||
        !tokenManagerType
      ) {
        // Build a detailed error message showing which data is missing
        const missingData = [];
        if (!tokenId) missingData.push("tokenId");
        if (!tokenAddress) missingData.push("tokenAddress");
        if (!tokenManagerAddress) missingData.push("tokenManagerAddress");
        if (!tokenManagerType) missingData.push("tokenManagerType");

        throw new Error(
          `Failed to extract critical token data from transaction: ${missingData.join(", ")} missing. ` +
            `Transaction hash: ${initialResponse.hash}`
        );
      }

      // Format tokenId with 0x prefix if it doesn't have it yet
      if (tokenId && !tokenId.startsWith("0x")) {
        tokenId = `0x${tokenId}`;
      }

      // Return the complete result
      const result: DeployAndRegisterTokenResultStellar = {
        hash: initialResponse.hash,
        status: "SUCCESS",
        tokenId,
        tokenAddress,
        tokenManagerAddress,
        tokenManagerType,
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
    deployAndRegisterStellarToken,
    isLoading,
    error,
    data,
  };
}
