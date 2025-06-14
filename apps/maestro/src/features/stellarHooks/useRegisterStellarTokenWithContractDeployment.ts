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
            onStatusUpdate?.(status);
          }
        },
      });

      const extractedTokenAddress =
        tokenRegistrationResult.tokenAddress || tokenAddress;

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

  return {
    registerTokenWithContractDeployment,
    isLoading,
    error,
    data,
  };
}
