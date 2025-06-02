import { useState } from "react";

import type { StellarWalletsKit } from "@creit.tech/stellar-wallets-kit";
import { rpc, Transaction } from "@stellar/stellar-sdk";

import { stellarChainConfig } from "~/config/chains";
import type { DeployAndRegisterTransactionState } from "~/features/CanonicalTokenDeployment/CanonicalTokenDeployment.state";
import { trpc } from "~/lib/trpc";
import { STELLAR_NETWORK_PASSPHRASE } from "~/server/routers/stellar/utils/config";
import { useStellarTransactionPoller } from "./useStellarTransactionPoller";

export interface DeployStellarAssetContractParams {
  kit: StellarWalletsKit;
  tokenAddress?: string; // Can be in format tokenSymbol-Issuer or contract address starting with "C"
  assetCode?: string; // Optional if tokenAddress is provided
  issuer?: string; // Optional if tokenAddress is provided
  onStatusUpdate?: (status: DeployAndRegisterTransactionState) => void;
}

export interface DeployStellarAssetContractResult {
  hash: string;
  status: string;
  contractId: string;
  exists: boolean;
}

export function useDeployStellarTokenSmartContract() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<DeployStellarAssetContractResult | null>(
    null
  );

  const { pollTransaction } = useStellarTransactionPoller();

  const { mutateAsync: getStellarAssetContractTxBytes } =
    trpc.stellar.getStellarAssetContractTxBytes.useMutation();

  const deployStellarTokenSmartContract = async ({
    kit,
    assetCode,
    issuer,
    onStatusUpdate,
  }: DeployStellarAssetContractParams): Promise<DeployStellarAssetContractResult> => {
    if (!kit) {
      throw new Error("StellarWalletsKit not provided");
    }

    setIsLoading(true);
    setError(null);

    try {
      // Get the public key from the wallet
      let publicKey: string;
      try {
        publicKey = (await kit.getAddress()).address;
        if (!publicKey) {
          throw new Error("Stellar wallet not connected");
        }
      } catch (error) {
        throw new Error("Failed to get Stellar wallet public key");
      }

      // 1. Get transaction bytes for Stellar Asset Contract deployment
      const { transactionXDR, contractId, exists } =
        await getStellarAssetContractTxBytes({
          caller: publicKey,
          assetCode,
          issuer,
        });

      console.log({ contractId, exists });

      // If the contract already exists, return early with success
      if (exists) {
        const result: DeployStellarAssetContractResult = {
          hash: "", // No transaction was submitted
          status: "SUCCESS",
          contractId,
          exists: true,
        };
        setData(result);
        setIsLoading(false);
        return result;
      }

      // Notify that we're waiting for user approval
      onStatusUpdate?.({
        type: "pending_approval",
        step: 1,
        totalSteps: 1,
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

      // 4. Poll for transaction completion
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

      // 5. Return the result
      const result: DeployStellarAssetContractResult = {
        hash: initialResponse.hash,
        status: "SUCCESS",
        contractId,
        exists: false,
      };

      setData(result);
      setIsLoading(false);
      return result;
    } catch (e) {
      const error = e instanceof Error ? e : new Error(String(e));
      setError(error);
      setIsLoading(false);
      throw error;
    }
  };

  return {
    deployStellarTokenSmartContract,
    isLoading,
    error,
    data,
  };
}
