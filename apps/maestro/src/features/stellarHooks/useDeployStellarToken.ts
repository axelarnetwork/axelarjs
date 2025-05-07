import { useCallback } from "react";

import { TokenManagerType } from "~/lib/drizzle/schema/common";

import { trpc } from "~/lib/trpc";
import { useAccount } from "~/lib/hooks";
import { useStellarKit } from "~/lib/providers/StellarWalletKitProvider";

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
  const { kit } = useStellarKit();
  
  // Use tRPC mutation to call server-side procedure
  const { mutateAsync: getStellarDeployTokenTx } = 
    trpc.stellar.getDeployTokenTx.useMutation();
  
  // Deploy token function
  const deployStellarToken = useCallback(
    async (params: DeployStellarTokenParams): Promise<DeployStellarTokenResult> => {
      if (!currentAccount) {
        throw new Error("Wallet not connected");
      }
      
      if (!kit) {
        throw new Error("Stellar wallet kit not initialized");
      }
      
      // Call the server to get the mock token data (IDs, addresses, etc)
      const result = await getStellarDeployTokenTx({
        symbol: params.symbol,
        name: params.name,
        decimals: params.decimals,
        initialSupply: params.initialSupply.toString(),
        minterAddress: params.minterAddress || currentAccount,
        destinationChainIds: params.destinationChainIds,
        gasValues: params.gasValues.map(v => v.toString()),
      });
      
      try {
        // 1. Use the network passphrase for the testnet
        const networkPassphrase = process.env.NEXT_PUBLIC_STELLAR_NETWORK_PASSPHRASE || "Test SDF Network ; September 2015";
        
        // 2. Have the user sign the transaction with their wallet
        console.log("Requesting signature from wallet...");
        
        // We use the transaction XDR returned by the server
        console.log("Transaction XDR to be signed:", result.transactionXDR);
        
        // We use the signTransaction method from StellarWalletKit
        // The transaction was already created with the correct sequence number in the backend
        console.log("Requesting signature from wallet...");
        const { signedTxXdr } = await kit.signTransaction(result.transactionXDR, {
          networkPassphrase,
        });
        
        // 3. Submit the transaction to the network using fetch API
        console.log("Submitting transaction to network via Horizon API...");
        const horizonUrl = process.env.NEXT_PUBLIC_STELLAR_HORIZON_URL || 'https://horizon-testnet.stellar.org';
        
        // Submit the transaction using fetch
        const horizonResponse = await fetch(`${horizonUrl}/transactions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: `tx=${encodeURIComponent(signedTxXdr)}`
        });
        
        // Process the Horizon API response
        const responseData = await horizonResponse.json();
        console.log("Horizon API response:", responseData);
        
        // Check if the submission was successful
        if (!horizonResponse.ok) {
          throw new Error(`Transaction submission failed: ${responseData.title || responseData.detail || 'Unknown error'}`);
        }
        
        // The transaction was successfully signed and submitted
        // Extract the transaction hash from the Horizon API response
        const txHash = responseData.hash;
        
        console.log("Transaction successfully submitted with hash:", txHash);
        console.log("You can verify the transaction in the Stellar Explorer:");
        console.log(`https://stellar.expert/explorer/testnet/tx/${txHash}`);
        
        // Return result with the transaction hash
        return {
          digest: txHash,
          deploymentMessageId: result.deploymentMessageId,
          tokenAddress: result.tokenAddress,
          tokenId: result.tokenId,
          tokenManagerAddress: result.tokenManagerAddress,
          tokenManagerType: result.tokenManagerType as TokenManagerType,
          minterAddress: params.minterAddress || currentAccount,
          events: [],
        };
      } catch (error: any) {
        console.error("Error during Stellar transaction signing/submission:", error);
        // Extract meaningful error message if possible
        let errorMessage = "Failed to submit transaction to Stellar network";
        
        if (error.response && error.response.data && error.response.data.extras) {
          // Horizon API error format
          errorMessage = `Stellar error: ${error.response.data.extras.result_codes.transaction}`;
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        throw new Error(errorMessage);
      }
    },
    [currentAccount, getStellarDeployTokenTx, kit]
  );
  
  return { deployStellarToken };
}
