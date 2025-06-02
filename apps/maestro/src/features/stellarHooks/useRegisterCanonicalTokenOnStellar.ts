import { useState } from "react";

import { rpc, scValToNative, Transaction, xdr } from "@stellar/stellar-sdk";

import { stellarChainConfig } from "~/config/chains";
import { useCanonicalTokenDeploymentStateContainer } from "~/features/CanonicalTokenDeployment";
import type { DeployAndRegisterTransactionState } from "~/features/InterchainTokenDeployment";
import { useStellarTransactionPoller } from "~/features/stellarHooks/useStellarTransactionPoller";
import { useStellarKit } from "~/lib/providers/StellarWalletKitProvider";
import { trpc } from "~/lib/trpc";
import { STELLAR_NETWORK_PASSPHRASE } from "~/server/routers/stellar/utils/config";

export type RegisterCanonicalTokenOnStellarParams = {
  tokenAddress: string;
  destinationChains: string[];
  gasValues: bigint[];
  onStatusUpdate?: (status: DeployAndRegisterTransactionState) => void;
};

export type RegisterCanonicalTokenOnStellarResult = {
  hash: string;
  status: string;
  tokenId: string;
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
        step: 1,
        totalSteps: destinationChains.length > 0 ? 2 : 1,
      });

      const { transactionXDR } = await getRegisterCanonicalTokenTxBytes({
        caller: publicKey,
        tokenAddress,
        destinationChainIds: destinationChains,
        gasValues: gasValues.map((v) => v.toString()),
      });

      const { signedTxXdr } = await kit.signTransaction(transactionXDR, {
        networkPassphrase: STELLAR_NETWORK_PASSPHRASE,
      });
      const rpcUrl = stellarChainConfig.rpcUrls.default.http[0];
      const server = new rpc.Server(rpcUrl);
      const tx = new Transaction(signedTxXdr, STELLAR_NETWORK_PASSPHRASE);

      const txHash = tx.hash().toString("hex");

      onStatusUpdate?.({
        type: "deploying",
        txHash: txHash,
      });

      const initialResponse = await server.sendTransaction(tx);

      if (
        initialResponse.status === "ERROR" ||
        initialResponse.status === "DUPLICATE" ||
        initialResponse.status === "TRY_AGAIN_LATER"
      ) {
        const errorMessage = `Stellar canonical token registration failed with status: ${initialResponse.status}. Error: ${JSON.stringify(initialResponse.errorResult)}`;
        throw new Error(errorMessage);
      }

      if (initialResponse.status === "PENDING") {
        onStatusUpdate?.({
          type: "deploying",
          txHash: initialResponse.hash,
        });
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

      const getTxResponse = await server.getTransaction(initialResponse.hash);

      let tokenId: string | undefined;
      let extractedTokenManagerAddress: string | undefined;
      let tokenManagerType = "lock_unlock" as const; // Default for canonical tokens

      // Check if we have resultMetaXdr in the response
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

          // Extract tokenManagerAddress from events
          const sorobanMeta = transactionMeta.v3()?.sorobanMeta();
          const events = sorobanMeta?.events();

          console.log("Events:", events);

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

      // Verificar se conseguimos extrair todos os dados necessários dos eventos
      const missingData = [];
      if (!tokenId) missingData.push("tokenId");
      if (!extractedTokenManagerAddress)
        missingData.push("tokenManagerAddress");

      // Se algum dado estiver faltando, lançar um erro detalhado
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
        tokenManagerAddress: extractedTokenManagerAddress!,
        tokenManagerType: tokenManagerType,
        deploymentMessageId:
          destinationChains.length > 0 ? `${initialResponse.hash}` : undefined,
      };

      setData(result);
      return result;
    } catch (e) {
      const error = e instanceof Error ? e : new Error(String(e));
      setError(error);
      actions.setTxState({ type: "idle" });
      onStatusUpdate?.({ type: "idle" });
      throw error;
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
