import { useState } from "react";

import { humanizeEvents, xdr } from "@stellar/stellar-sdk";

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
            // Use the helper function to parse events
            const parsedEventData = parseCanonicalTokenEvents(events);

            // Update local variables with parsed data
            if (parsedEventData.tokenId) {
              tokenId = parsedEventData.tokenId;
              console.log("Extracted tokenId from event:", tokenId);
            }

            if (parsedEventData.tokenAddress) {
              extractedTokenAddress = parsedEventData.tokenAddress;
              console.log(
                "Extracted tokenAddress from event:",
                extractedTokenAddress
              );
            }

            if (parsedEventData.tokenManagerAddress) {
              extractedTokenManagerAddress =
                parsedEventData.tokenManagerAddress;
              console.log(
                "Extracted tokenManagerAddress from event:",
                extractedTokenManagerAddress
              );
            }

            if (parsedEventData.tokenManagerType) {
              tokenManagerType = parsedEventData.tokenManagerType;
              console.log(
                "Extracted tokenManagerType from event:",
                tokenManagerType
              );
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

/**
 * Parsed data from Stellar canonical token registration events
 */
interface ParsedCanonicalTokenData {
  tokenId?: string;
  tokenAddress?: string;
  tokenManagerAddress?: string;
  tokenManagerType?: "lock_unlock";
}

/**
 * Parses Stellar canonical token registration events to extract token data
 * @param events - Raw Stellar events from transaction metadata
 * @param initialData - Optional initial data to supplement event data
 * @returns Parsed canonical token data
 */
function parseCanonicalTokenEvents(
  events: xdr.DiagnosticEvent[],
  initialData: Partial<ParsedCanonicalTokenData> = {}
): ParsedCanonicalTokenData {
  const result: ParsedCanonicalTokenData = { ...initialData };

  const humanReadableEvents = humanizeEvents(events);

  for (const event of humanReadableEvents) {
    if (!event.topics || event.topics.length === 0) continue;

    const eventName = event.topics[0];

    if (eventName === "token_manager_deployed" && event.topics.length >= 5) {
      // Extract tokenId from event
      if (
        !result.tokenId &&
        event.topics.length > 1 &&
        typeof event.topics[1] === "string"
      ) {
        result.tokenId = event.topics[1];
      }

      // Extract tokenAddress from event
      if (
        !result.tokenAddress &&
        event.topics.length > 2 &&
        typeof event.topics[2] === "string"
      ) {
        result.tokenAddress = event.topics[2];
      }

      // Extract tokenManagerAddress
      if (
        !result.tokenManagerAddress &&
        event.topics.length > 3 &&
        typeof event.topics[3] === "string"
      ) {
        result.tokenManagerAddress = event.topics[3];
      }

      // Extract tokenManagerType - for canonical tokens it should be type 2 (lock_unlock)
      if (result.tokenManagerType === undefined && event.topics.length > 4) {
        const typeValue = event.topics[4];
        if (typeof typeValue === "number" || typeof typeValue === "string") {
          // Type 2 is lock_unlock for canonical tokens
          if (Number(typeValue) === 2) {
            result.tokenManagerType = "lock_unlock";
          }
        }
      }
    }
  }

  return result;
}

export default useRegisterCanonicalTokenOnStellar;
