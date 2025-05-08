import { z } from "zod";
import { randomUUID } from "crypto";
import { Address } from "stellar-sdk";
import { nativeToScVal } from "stellar-sdk";

import { TOKEN_MANAGER_TYPES } from "~/lib/drizzle/schema/common";

import { publicProcedure } from "~/server/trpc";
import { getStellarChainConfig } from "./utils";
import {
  INTERCHAIN_TOKEN_SERVICE_CONTRACT,
  saltToBytes32,
  hexToScVal,
  tokenMetadataToScVal,
  fetchStellarAccount,
  createContractTransaction,
  generateMockAddresses
} from "./utils/transactions";

// All utility functions have been moved to ./utils/transactions.ts

export const getDeployTokenTx = publicProcedure
  .input(
    z.object({
      symbol: z.string(),
      name: z.string(),
      decimals: z.number(),
      initialSupply: z.string(),
      minterAddress: z.string(),
      salt: z.string().optional(),
      destinationChainIds: z.array(z.string()),
      gasValues: z.array(z.string()),
    })
  )
  .mutation(async ({ input, ctx }) => {
    try {
      // Get Stellar chain config
      await getStellarChainConfig(ctx);
      
      // Create salt from input or generate a random one
      const salt = input.salt || saltToBytes32(randomUUID());
      
      console.log(`Processing token deployment with parameters:`);
      console.log(`Symbol: ${input.symbol}`);
      console.log(`Name: ${input.name}`);
      console.log(`Decimals: ${input.decimals}`);
      console.log(`Initial Supply: ${input.initialSupply}`);
      console.log(`Salt: ${salt}`);
      console.log(`Minter Address: ${input.minterAddress}`);
      
      // Fetch the user's account
      const account = await fetchStellarAccount(input.minterAddress);
      console.log(`Account sequence number: ${account.sequenceNumber()}`);
      
      // Prepare the operation arguments
      const caller = new Address(input.minterAddress).toScVal();
      const minter = caller; // Using the same address as both caller and minter
      
      // Create and prepare the transaction
      const { transactionXDR } = await createContractTransaction({
        contractAddress: INTERCHAIN_TOKEN_SERVICE_CONTRACT,
        method: 'deploy_interchain_token',
        account,
        args: [
          caller,
          hexToScVal(salt),
          tokenMetadataToScVal(input.decimals, input.name, input.symbol),
          nativeToScVal(input.initialSupply, { type: 'i128' }),
          minter
        ]
      });
      
      // Generate a token ID based on the salt
      const tokenId = salt;
      
      // Generate mock addresses for token and token manager
      const { tokenAddress, tokenManagerAddress } = generateMockAddresses();
      
      // Return the transaction XDR and token data
      return {
        transactionXDR,
        tokenId,
        tokenAddress,
        tokenManagerAddress,
        tokenManagerType: TOKEN_MANAGER_TYPES[0], // "mint_burn"
        deploymentMessageId: randomUUID(),
        tokenData: {
          symbol: input.symbol,
          name: input.name,
          decimals: input.decimals,
          salt,
          initialSupply: input.initialSupply,
          minterAddress: input.minterAddress
        }
      };
    } catch (error) {
      console.error("Error in getDeployTokenTx:", error);
      throw error;
    }
  });
