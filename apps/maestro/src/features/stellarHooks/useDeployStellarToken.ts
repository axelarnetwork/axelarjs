import { useState } from "react";

import type { StellarWalletsKit } from "@creit.tech/stellar-wallets-kit";
import { humanizeEvents, xdr } from "@stellar/stellar-sdk";

import type { DeployAndRegisterTransactionState as BaseDeployAndRegisterTransactionState } from "~/features/InterchainTokenDeployment/InterchainTokenDeployment.state";
import { trpc } from "~/lib/trpc";
import { useRegisterRemoteInterchainTokenOnStellar } from "../RegisterRemoteTokens/hooks/useRegisterRemoteInterchainTokenOnStellar";
import { useStellarTransactionPoller } from "./useStellarTransactionPoller";
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

  const { pollTransaction } = useStellarTransactionPoller();
  const { signAndSubmitTransaction } = useStellarTransactionSigner();

  const { mutateAsync: getDeployTokenTxBytes } =
    trpc.stellar.getDeployTokenTxBytes.useMutation();

  const {
    registerRemoteInterchainToken: registerRemoteInterchainTokenOnStellar,
  } = useRegisterRemoteInterchainTokenOnStellar();

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

    // First step: deploy the token on Stellar
    onStatusUpdate?.({
      type: "pending_approval",
      step: 1,
      totalSteps: destinationChainIds.length > 0 ? 2 : 1,
    });

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

      // 2. Sign and submit the transaction
      const initialResponse =
        await signAndSubmitTransaction<DeployAndRegisterTransactionState>({
          kit,
          transactionXDR,
          onStatusUpdate,
          createDeployingStatus: (txHash: string) => ({
            type: "deploying",
            txHash,
            step: 1,
            totalSteps: destinationChainIds.length > 0 ? 2 : 1,
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
            const humanReadableEvents = humanizeEvents(events);

            for (const event of humanReadableEvents) {
              if (!event.topics || event.topics.length === 0) continue;

              const eventName = event.topics[0];

              if (eventName === "interchain_token_deployed") {
                // Extract tokenAddress from the third topic (index 2)
                if (
                  !tokenAddress &&
                  event.topics.length > 2 &&
                  typeof event.topics[2] === "string"
                ) {
                  tokenAddress = event.topics[2];
                }
              } else if (eventName === "token_manager_deployed") {
                // Extract tokenManagerAddress from the fourth topic (index 3)
                if (
                  !tokenManagerAddress &&
                  event.topics.length > 3 &&
                  typeof event.topics[3] === "string"
                ) {
                  tokenManagerAddress = event.topics[3];
                }

                // Extract tokenManagerType from the fifth topic (index 4)
                if (tokenManagerType === undefined && event.topics.length > 4) {
                  const typeValue = event.topics[4];
                  if (
                    typeof typeValue === "number" ||
                    typeof typeValue === "string"
                  ) {
                    tokenManagerType =
                      String(typeValue) === "0" ? "mint_burn" : "lock_unlock";
                  }
                }
              }

              // If all details are found, no need to process further events
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
          // Error extracting token information from transaction
          console.error("Error parsing transaction events:", error);
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

      // 6. If there are destinationChainIds, do remote deployment
      let remoteDeployResult;
      if (destinationChainIds.length > 0) {
        onStatusUpdate?.({
          type: "pending_approval",
          step: 2,
          totalSteps: 2,
        });
        remoteDeployResult = await registerRemoteInterchainTokenOnStellar({
          salt,
          destinationChainIds,
          gasValues,
          onStatusUpdate,
        });
      }

      // 7. Return the complete result
      // If there's a remote deployment, use the remote transaction hash as the main hash
      const result: DeployTokenResultStellar = {
        hash: remoteDeployResult ? remoteDeployResult : initialResponse.hash,
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
    deployStellarToken,
    isLoading,
    error,
    data,
  };
}
