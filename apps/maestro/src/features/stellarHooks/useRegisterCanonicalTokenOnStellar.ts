import { useState } from "react";

import { humanizeEvents } from "@stellar/stellar-sdk";

import {
  useCanonicalTokenDeploymentStateContainer,
  type DeployAndRegisterTransactionState as BaseDeployAndRegisterTransactionState,
} from "~/features/CanonicalTokenDeployment/CanonicalTokenDeployment.state";
import { useStellarTransactionPoller } from "~/features/stellarHooks/useStellarTransactionPoller";
import { useStellarKit } from "~/lib/providers/StellarWalletKitProvider";
import { trpc } from "~/lib/trpc";
import { useStellarTransactionSigner } from "./useStellarTransactionSigner";

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
            const humanReadableEvents = humanizeEvents(events);

            for (const event of humanReadableEvents) {
              if (!event.topics || event.topics.length === 0) continue;

              const eventName = event.topics[0];

              if (
                eventName === "token_manager_deployed" &&
                event.topics.length >= 5
              ) {
                // In the example: ["token_manager_deployed", "kOH4I62W0LAo4Z7poBzdtJwjKE3Ei6iqtPezCRzlOSY=", "CDQM…RC6I", "CANB…CPEK", 2]
                // tokenId is at index 1
                // tokenAddress is at index 2
                // tokenManagerAddress is at index 3
                // tokenManagerType is at index 4

                // Extract tokenId from event
                if (
                  !tokenId &&
                  event.topics.length > 1 &&
                  typeof event.topics[1] === "string"
                ) {
                  tokenId = event.topics[1];
                  console.log("Extracted tokenId from event:", tokenId);
                }

                // Extract tokenAddress from event
                if (
                  !extractedTokenAddress &&
                  event.topics.length > 2 &&
                  typeof event.topics[2] === "string"
                ) {
                  extractedTokenAddress = event.topics[2];
                  console.log(
                    "Extracted tokenAddress from event:",
                    extractedTokenAddress
                  );
                }

                // Extract tokenManagerAddress
                if (
                  !extractedTokenManagerAddress &&
                  event.topics.length > 3 &&
                  typeof event.topics[3] === "string"
                ) {
                  extractedTokenManagerAddress = event.topics[3];
                  console.log(
                    "Extracted tokenManagerAddress from event:",
                    extractedTokenManagerAddress
                  );
                }

                // Extract tokenManagerType
                if (event.topics.length > 4) {
                  const typeValue = event.topics[4];
                  if (
                    typeof typeValue === "number" ||
                    typeof typeValue === "string"
                  ) {
                    // Type 2 is lock_unlock for canonical tokens
                    if (Number(typeValue) === 2) {
                      tokenManagerType = "lock_unlock";
                      console.log(
                        "Extracted tokenManagerType from event:",
                        tokenManagerType
                      );
                    }
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
