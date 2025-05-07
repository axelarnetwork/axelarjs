import { useCallback } from "react";
import { Transaction } from "stellar-sdk";

import { TokenManagerType } from "~/lib/drizzle/schema/common";

import { trpc } from "~/lib/trpc";
import { useAccount } from "~/lib/hooks";

export interface DeployStellarTokenParams {
  initialSupply: bigint;
  symbol: string;
  name: string;
  decimals: number;
  destinationChainIds: string[];
  gasValues: bigint[];
  minterAddress?: string;
  skipRegister?: boolean;
}

export interface DeployStellarTokenResult {
  digest: string;
  deploymentMessageId: string;
  tokenAddress: string;
  tokenId: string;
  tokenManagerAddress: string;
  tokenManagerType?: TokenManagerType;
  minterAddress?: string;
  events?: any[];
}

export function useDeployStellarToken() {
  const { address: currentAccount } = useAccount();
  
  // Use tRPC mutation to call server-side procedure
  const { mutateAsync: getStellarDeployTokenTx } = 
    trpc.stellar.getDeployTokenTx.useMutation();
  
  // Deploy token function
  const deployStellarToken = useCallback(
    async (params: DeployStellarTokenParams): Promise<DeployStellarTokenResult> => {
      if (!currentAccount) {
        throw new Error("Wallet not connected");
      }
      
      // Call the server to get the transaction data
      const result = await getStellarDeployTokenTx({
        symbol: params.symbol,
        name: params.name,
        decimals: params.decimals,
        initialSupply: params.initialSupply.toString(),
        minterAddress: params.minterAddress || currentAccount,
        destinationChainIds: params.destinationChainIds,
        gasValues: params.gasValues.map(v => v.toString()),
      });
      
      // In a real implementation, we would:
      // 1. Convert the XDR to a Transaction object
      // 2. Have the user sign it with their wallet
      // 3. Submit the signed transaction to the network
      
      // For now, we'll simulate a successful transaction
      console.log("Mock Stellar transaction XDR:", result.transactionXDR);
      
      // Parse the XDR to show it in the console (for debugging)
      try {
        const tx = new Transaction(result.transactionXDR, "Test SDF Network ; September 2015");
        console.log("Parsed transaction:", tx);
      } catch (error) {
        console.error("Error parsing transaction XDR:", error);
      }
      
      // Return mock result with proper typing
      return {
        digest: `stellar-tx-${Date.now()}`,
        deploymentMessageId: result.deploymentMessageId,
        tokenAddress: result.tokenAddress,
        tokenId: result.tokenId,
        tokenManagerAddress: result.tokenManagerAddress,
        tokenManagerType: result.tokenManagerType as TokenManagerType, // Cast to correct type
        minterAddress: params.minterAddress || currentAccount,
        events: [],
      };
    },
    [currentAccount, getStellarDeployTokenTx]
  );
  
  return { deployStellarToken };
}
