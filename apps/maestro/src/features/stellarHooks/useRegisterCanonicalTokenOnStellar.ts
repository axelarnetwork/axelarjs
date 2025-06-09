import { useState } from "react";

import { scValToNative, xdr } from "@stellar/stellar-sdk";

import {
  useCanonicalTokenDeploymentStateContainer,
  type DeployAndRegisterTransactionState as BaseDeployAndRegisterTransactionState,
} from "~/features/CanonicalTokenDeployment/CanonicalTokenDeployment.state";
import { useStellarTransactionPoller } from "~/features/stellarHooks/useStellarTransactionPoller";
import { useStellarKit } from "~/lib/providers/StellarWalletKitProvider";
import { trpc } from "~/lib/trpc";
import { useStellarTransactionSigner } from "./useStellarTransactionSigner";

// Extend the base type to include step and totalSteps for Stellar deployments
type DeployAndRegisterTransactionState =
  | Extract<BaseDeployAndRegisterTransactionState, { type: "idle" }>
  | (Extract<
      BaseDeployAndRegisterTransactionState,
      { type: "pending_approval" }
    > & { step?: number; totalSteps?: number })
  | (Extract<BaseDeployAndRegisterTransactionState, { type: "deploying" }> & {
      step?: number;
      totalSteps?: number;
    })
  | Extract<BaseDeployAndRegisterTransactionState, { type: "deployed" }>;

export type RegisterCanonicalTokenOnStellarParams = {
  tokenAddress: string;
  destinationChains: string[];
  gasValues: bigint[];
  onStatusUpdate?: (status: DeployAndRegisterTransactionState) => void;
};

export type RegisterCanonicalTokenOnStellarResult = {
  hash: string;
  status: "SUCCESS" | "ERROR";
  tokenId: string;
  tokenAddress?: string;
  tokenManagerAddress: string;
  tokenManagerType: "lock_unlock";
  deploymentMessageId?: string;
};

export function useRegisterCanonicalTokenOnStellar() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] =
    useState<RegisterCanonicalTokenOnStellarResult | null>(null);

  const { kit } = useStellarKit();
  const { actions } = useCanonicalTokenDeploymentStateContainer();
  const { pollTransaction } = useStellarTransactionPoller();
  const { signAndSubmitTransaction } = useStellarTransactionSigner();

  const { mutateAsync: getRegisterCanonicalTokenTxBytes } =
    trpc.stellar.getRegisterCanonicalTokenTxBytes.useMutation();

  const registerCanonicalToken = async ({
    tokenAddress,
    destinationChains,
    gasValues,
    onStatusUpdate,
  }: RegisterCanonicalTokenOnStellarParams): Promise<RegisterCanonicalTokenOnStellarResult> => {
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

    setIsLoading(true);
    setError(null);

    try {
      actions.setTxState({ type: "pending_approval" });
      onStatusUpdate?.({
        type: "pending_approval",
      });

      const { transactionXDR } = await getRegisterCanonicalTokenTxBytes({
        caller: publicKey,
        tokenAddress,
        destinationChainIds: destinationChains,
        gasValues: gasValues.map((v) => v.toString()),
      });

      const initialResponse =
        await signAndSubmitTransaction<DeployAndRegisterTransactionState>({
          kit,
          transactionXDR,
          onStatusUpdate,
          createDeployingStatus: (txHash) => ({
            type: "deploying",
            txHash,
          }),
        });

      const { server } = initialResponse;

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

      const getTxResponse = await server.getTransaction(initialResponse.hash);

      let tokenId: string | undefined;
      let extractedTokenAddress: string | undefined;
      let extractedTokenManagerAddress: string | undefined;
      let tokenManagerType = "lock_unlock" as const; // Default for canonical tokens

      // Check if we have resultMetaXdr in the response
      const txResponseWithMeta = getTxResponse as any;
      if (txResponseWithMeta.resultMetaXdr) {
        try {
          // Extract data from events
          const transactionMeta = txResponseWithMeta.resultMetaXdr;
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

              // Process token_manager_deployed event
              if (
                eventName === "token_manager_deployed" &&
                eventTopics.length >= 5
              ) {
                // In the example: ["token_manager_deployed"sym, kOH4I62W0LAo4Z7poBzdtJwjKE3Ei6iqtPezCRzlOSY=bytes, CDQM…RC6I, CANB…CPEK, 2u32]
                // tokenId is at index 1
                // tokenAddress is at index 2
                // tokenManagerAddress is at index 3
                // tokenManagerType is at index 4

                // Extract tokenId from event
                const topic1 = eventTopics[1]; // tokenId
                if (
                  !tokenId &&
                  topic1 &&
                  topic1.switch() === xdr.ScValType.scvBytes()
                ) {
                  try {
                    tokenId = topic1.bytes().toString("hex");
                    console.log("Extracted tokenId from event:", tokenId);
                  } catch (error) {
                    console.error(
                      "Error extracting tokenId from event:",
                      error
                    );
                  }
                }

                // Extract tokenAddress from event
                const topic2 = eventTopics[2]; // tokenAddress
                if (!extractedTokenAddress && topic2) {
                  try {
                    extractedTokenAddress = scValToNative(topic2);
                    console.log(
                      "Extracted tokenAddress from event:",
                      extractedTokenAddress
                    );
                  } catch (error) {
                    console.error(
                      "Error extracting tokenAddress from event:",
                      error
                    );
                  }
                }

                const topic3 = eventTopics[3]; // tokenManagerAddress
                const topic4 = eventTopics[4]; // tokenManagerType

                // Extract tokenManagerAddress
                if (
                  !extractedTokenManagerAddress &&
                  topic3 &&
                  topic3.switch() === xdr.ScValType.scvAddress()
                ) {
                  try {
                    extractedTokenManagerAddress = scValToNative(topic3);
                  } catch (error) {
                    // Error extracting tokenManagerAddress
                    try {
                      const addressBytes = topic3.address().contractId();
                      if (addressBytes) {
                        extractedTokenManagerAddress =
                          addressBytes.toString("hex");
                      }
                    } catch (e) {
                      // Failed to extract raw address bytes
                    }
                  }
                }

                // Extract tokenManagerType
                if (topic4 && topic4.switch() === xdr.ScValType.scvU32()) {
                  try {
                    const typeNumber = scValToNative(topic4);
                    // Type 2 is lock_unlock for canonical tokens
                    if (typeNumber === 2) {
                      tokenManagerType = "lock_unlock";
                    }
                  } catch (error) {
                    // Error extracting tokenManagerType
                    // Keep default "lock_unlock" for canonical tokens
                  }
                }
              }
            }
          }
        } catch (error) {
          console.error("Error extracting data from transaction:", error);
        }
      }

      // Format tokenId with 0x prefix if it doesn't have it yet
      if (tokenId && !tokenId.startsWith("0x")) {
        tokenId = `0x${tokenId}`;
      }

      // Check if we have all the data we need
      const missingData = [];
      if (!tokenId) missingData.push("tokenId");
      if (!extractedTokenAddress) missingData.push("tokenAddress");
      if (!extractedTokenManagerAddress)
        missingData.push("tokenManagerAddress");

      // If any data is missing, throw a detailed error
      if (missingData.length > 0) {
        throw new Error(
          `Failed to extract critical token data from transaction events: ${missingData.join(", ")} missing. ` +
            `Transaction hash: ${initialResponse.hash}. ` +
            `Make sure the transaction contains the expected events.`
        );
      }

      const result: RegisterCanonicalTokenOnStellarResult = {
        hash: initialResponse.hash,
        status: "SUCCESS",
        tokenId: tokenId!,
        tokenAddress: extractedTokenAddress!,
        tokenManagerAddress: extractedTokenManagerAddress!,
        tokenManagerType: tokenManagerType,
        deploymentMessageId: initialResponse.hash,
      };

      setData(result);
      return result;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    registerCanonicalToken,
    isLoading,
    error,
    data,
  };
}

export default useRegisterCanonicalTokenOnStellar;
