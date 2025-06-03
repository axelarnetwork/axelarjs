import { useState } from "react";

import type { StellarWalletsKit } from "@creit.tech/stellar-wallets-kit";

import type { DeployAndRegisterTransactionState } from "~/features/CanonicalTokenDeployment/CanonicalTokenDeployment.state";
import { useDeployStellarTokenSmartContract } from "./useDeployStellarTokenSmartContract";
import { useRegisterCanonicalTokenOnStellar } from "./useRegisterCanonicalTokenOnStellar";

export interface RegisterStellarTokenWithContractParams {
  kit: StellarWalletsKit;
  tokenAddress: string; // Can be in format tokenSymbol-Issuer or contract address
  destinationChains: string[];
  gasValues: bigint[];
  onStatusUpdate?: (status: DeployAndRegisterTransactionState) => void;
}

export interface RegisterStellarTokenWithContractResult {
  contractDeployment: {
    hash: string;
    status: string;
    contractId: string;
    exists: boolean;
  } | null;
  tokenRegistration: {
    hash: string;
    status: string;
    tokenId: string;
    tokenManagerAddress: string;
    tokenManagerType: "lock_unlock";
    deploymentMessageId?: string;
  };
}

export function useRegisterStellarTokenWithContractDeployment() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] =
    useState<RegisterStellarTokenWithContractResult | null>(null);

  const { deployStellarTokenSmartContract } =
    useDeployStellarTokenSmartContract();
  const { registerCanonicalToken } = useRegisterCanonicalTokenOnStellar();

  // Using the parseTokenAddress function defined below

  const registerTokenWithContractDeployment = async ({
    kit,
    tokenAddress,
    destinationChains,
    gasValues,
    onStatusUpdate,
  }: RegisterStellarTokenWithContractParams): Promise<RegisterStellarTokenWithContractResult> => {
    if (!kit) {
      throw new Error("StellarWalletsKit not provided");
    }

    // Parse the token address to get assetCode and issuer
    const { assetCode, issuer } = parseTokenAddress(tokenAddress);

    setIsLoading(true);
    setError(null);

    try {
      // Step 1: Deploy the Stellar Asset Contract if needed
      const contractDeploymentResult = await deployStellarTokenSmartContract({
        kit,
        assetCode,
        issuer,
        onStatusUpdate: (status) => {
          if (status.type === "pending_approval") {
            onStatusUpdate?.({
              type: "pending_approval",
            });
          } else if (status.type === "deploying") {
            onStatusUpdate?.({
              type: "deploying",
              txHash: status.txHash,
            });
          } else {
            // For other status types like idle or deployed
            onStatusUpdate?.(status);
          }
        },
      });

      // Step 2: Register the token
      const tokenRegistrationResult = await registerCanonicalToken({
        tokenAddress,
        destinationChains,
        gasValues,
        onStatusUpdate: (status) => {
          if (status.type === "pending_approval") {
            onStatusUpdate?.({
              type: "pending_approval",
            });
          } else if (status.type === "deploying" && status.txHash) {
            onStatusUpdate?.({
              type: "deploying",
              txHash: status.txHash,
            });
          } else {
            // For other status types like idle or deployed
            onStatusUpdate?.(status);
          }
        },
      });

      const result: RegisterStellarTokenWithContractResult = {
        contractDeployment: contractDeploymentResult.exists
          ? null
          : contractDeploymentResult,
        tokenRegistration: tokenRegistrationResult,
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

  /**
   * Helper function to parse a token address into asset code and issuer
   * @param tokenAddress The token address in the format "CODE-ISSUER" or a contract address starting with "C"
   */
  const parseTokenAddress = (
    tokenAddress: string
  ): { assetCode: string; issuer: string } => {
    try {
      // If it's a contract address (starts with 'C')
      if (tokenAddress.startsWith("C")) {
        // For contract addresses, we'll use the contract address as the asset code
        // The actual handling would depend on how contract addresses are processed
        return {
          assetCode: tokenAddress,
          issuer: "",
        };
      }

      // Otherwise, try to parse as tokenSymbol-Issuer format
      const parts = tokenAddress.split("-");
      if (parts.length !== 2) {
        throw new Error(
          `Invalid token address format: ${tokenAddress}. Expected format: "CODE-ISSUER" or contract address starting with "C"`
        );
      }

      const [assetCode, issuer] = parts;

      // Validate the parts
      if (!assetCode || !issuer) {
        throw new Error(
          `Invalid token address format: ${tokenAddress}. Expected format: "CODE-ISSUER" or contract address starting with "C"`
        );
      }

      return {
        assetCode,
        issuer,
      };
    } catch (error) {
      throw new Error(
        `Invalid token address format: ${tokenAddress}. Expected format: "CODE:ISSUER"`
      );
    }
  };

  return {
    registerTokenWithContractDeployment,
    parseTokenAddress,
    isLoading,
    error,
    data,
  };
}
