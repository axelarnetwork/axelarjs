import { useState } from "react";

import type { StellarWalletsKit } from "@creit.tech/stellar-wallets-kit";

import type { DeployAndRegisterTransactionState } from "~/features/CanonicalTokenDeployment/CanonicalTokenDeployment.state";
import { useRegisterCanonicalTokenOnStellar } from "./useRegisterCanonicalTokenOnStellar";

export interface RegisterStellarTokenWithContractParams {
  kit: StellarWalletsKit;
  tokenAddress: string; // Can be in format tokenSymbol-Issuer or contract address
  destinationChains: string[];
  gasValues: bigint[];
  onStatusUpdate?: (status: DeployAndRegisterTransactionState) => void;
}

export interface RegisterStellarTokenWithContractResult {
  tokenRegistration: {
    hash: string;
    status: string;
    tokenId: string;
    tokenManagerAddress: string;
    tokenManagerType: "lock_unlock";
    deploymentMessageId?: string;
    tokenAddress: string;
  };
}

export function useRegisterStellarTokenWithContractDeployment() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] =
    useState<RegisterStellarTokenWithContractResult | null>(null);

  const { registerCanonicalToken } = useRegisterCanonicalTokenOnStellar();

  // We still keep the parseTokenAddress function for utility purposes
  // but it's no longer used in the main flow since the backend handles the parsing

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

    setIsLoading(true);
    setError(null);

    try {
      // With the new approach, we can directly register the token
      // The backend will handle SCA creation in the multicall if needed
      console.log(
        "Using new single-step flow with SCA creation in multicall if needed"
      );

      const tokenRegistrationResult = await registerCanonicalToken({
        tokenAddress,
        destinationChains,
        gasValues,
        onStatusUpdate: (status) => {
          if (status.type === "pending_approval") {
            onStatusUpdate?.({
              type: "pending_approval",
              // Note: step and totalSteps are handled in the parent component
            });
          } else if (status.type === "deploying" && status.txHash) {
            onStatusUpdate?.({
              type: "deploying",
              txHash: status.txHash,
              // Note: step and totalSteps are handled in the parent component
            });
          } else {
            // For other status types like idle or deployed
            onStatusUpdate?.(status);
          }
        },
      });

      // Extract the token address from the token registration result or use the input tokenAddress
      const extractedTokenAddress =
        tokenRegistrationResult.tokenAddress || tokenAddress;

      // Create the result with the tokenAddress included in the tokenRegistration
      const result: RegisterStellarTokenWithContractResult = {
        tokenRegistration: {
          ...tokenRegistrationResult,
          tokenAddress: extractedTokenAddress,
        },
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
