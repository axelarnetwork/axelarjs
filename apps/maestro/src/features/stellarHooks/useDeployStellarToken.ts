import type { StellarWalletsKit } from "@creit.tech/stellar-wallets-kit";
import { useCallback, useState } from "react";

import {
  deploy_interchain_token_stellar,
  type DeployAndRegisterInterchainTokenResult,
} from "~/server/routers/stellar/utils/tokenDeployments";
import type { DeployAndRegisterTransactionState } from "~/features/InterchainTokenDeployment";

export interface UseDeployStellarTokenInput {
  caller: string;
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

export interface UseDeployStellarTokenOutput {
  deployStellarTokenAsync: (
    params: UseDeployStellarTokenInput
  ) => Promise<DeployAndRegisterInterchainTokenResult | undefined>;
  isLoading: boolean;
  error: Error | null;
  data: DeployAndRegisterInterchainTokenResult | null;
}

export function useDeployStellarToken(): UseDeployStellarTokenOutput {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<DeployAndRegisterInterchainTokenResult | null>(
    null
  );

  const deployStellarTokenAsync = useCallback(
    async (params: UseDeployStellarTokenInput) => {
      setIsLoading(true);
      setError(null);
      setData(null);

      try {
        const result = await deploy_interchain_token_stellar(params);
        setData(result);
        return result;
      } catch (e) {
        setError(e instanceof Error ? e : new Error(String(e)));
        return undefined;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return {
    deployStellarTokenAsync,
    isLoading,
    error,
    data,
  };
}
