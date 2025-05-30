import { useState } from "react";

import { rpc, Transaction } from "@stellar/stellar-sdk";

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

  // Servidor RPC Stellar será inicializado dentro da função

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
      // Set initial state before starting
      actions.setTxState({ type: "pending_approval" });
      onStatusUpdate?.({
        type: "pending_approval",
        step: 1,
        totalSteps: destinationChains.length > 0 ? 2 : 1,
      });

      // Get transaction bytes for canonical token registration
      const { transactionXDR } = await getRegisterCanonicalTokenTxBytes({
        caller: publicKey,
        tokenAddress,
        destinationChainIds: destinationChains,
        gasValues: gasValues.map((v) => v.toString()),
      });

      // Sign the transaction
      const { signedTxXdr } = await kit.signTransaction(transactionXDR, {
        networkPassphrase: STELLAR_NETWORK_PASSPHRASE,
      });

      // Submit the transaction
      const rpcUrl = stellarChainConfig.rpcUrls.default.http[0];
      const server = new rpc.Server(rpcUrl);
      const tx = new Transaction(signedTxXdr, STELLAR_NETWORK_PASSPHRASE);

      // Get the transaction hash before sending it (will be used as GMP ID)
      const txHash = tx.hash().toString("hex");

      // Update status to deploying before sending transaction
      onStatusUpdate?.({
        type: "deploying",
        txHash: txHash,
      });

      const initialResponse = await server.sendTransaction(tx);

      // Check if the transaction was accepted for processing
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

      // Poll to check the transaction status
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

      // Transaction was successful
      const result: RegisterCanonicalTokenOnStellarResult = {
        hash: initialResponse.hash,
        status: "SUCCESS",
        tokenManagerAddress: tokenAddress,
        tokenManagerType: "lock_unlock",
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
