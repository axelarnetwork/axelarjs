import { useState } from "react";

import type { StellarWalletsKit } from "@creit.tech/stellar-wallets-kit";

import type { DeployAndRegisterTransactionState } from "~/features/InterchainTokenDeployment";
import { useDeployStellarTokenSmartContract } from "./useDeployStellarTokenSmartContract";
import { useRegisterCanonicalTokenOnStellar } from "./useRegisterCanonicalTokenOnStellar";

export interface RegisterStellarTokenWithContractParams {
  kit: StellarWalletsKit;
  tokenAddress: string;
  assetCode: string;
  issuer: string;
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

  const registerTokenWithContractDeployment = async ({
    kit,
    tokenAddress,
    assetCode,
    issuer,
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
      // Step 1: Deploy the Stellar Asset Contract if needed
      const contractDeploymentResult = await deployStellarTokenSmartContract({
        kit,
        assetCode,
        issuer,
        onStatusUpdate: (status) => {
          // Update the status with adjusted step counts
          if (
            status.type === "pending_approval" &&
            status.step !== undefined &&
            status.totalSteps !== undefined
          ) {
            onStatusUpdate?.({
              ...status,
              step: 1,
              totalSteps: 2,
            });
          } else {
            onStatusUpdate?.(status);
          }
        },
      });

      // Step 2: Register the token
      // Adjust the step count for the token registration
      const tokenRegistrationResult = await registerCanonicalToken({
        tokenAddress,
        destinationChains,
        gasValues,
        onStatusUpdate: (status) => {
          // Update the status with adjusted step counts
          if (
            status.type === "pending_approval" &&
            status.step !== undefined &&
            status.totalSteps !== undefined
          ) {
            onStatusUpdate?.({
              ...status,
              step: contractDeploymentResult.exists ? 2 : 1,
              totalSteps: contractDeploymentResult.exists ? 2 : 1,
            });
          } else {
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
   * @param tokenAddress The token address in the format "CODE:ISSUER"
   */
  const parseTokenAddress = (
    tokenAddress: string
  ): { assetCode: string; issuer: string } => {
    try {
      // Parse the token address in the format "CODE:ISSUER"
      const parts = tokenAddress.split(":");
      if (parts.length !== 2) {
        throw new Error(
          `Invalid token address format: ${tokenAddress}. Expected format: "CODE:ISSUER"`
        );
      }

      const [assetCode, issuer] = parts;

      // Validate the parts
      if (!assetCode || !issuer) {
        throw new Error(
          `Invalid token address format: ${tokenAddress}. Expected format: "CODE:ISSUER"`
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
