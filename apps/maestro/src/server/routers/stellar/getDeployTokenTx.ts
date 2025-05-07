import { z } from "zod";
import { randomUUID } from "crypto";
import {
  Account,
  Address,
  Contract,
  Networks,
  TransactionBuilder,
  xdr
} from "stellar-sdk";

import { TOKEN_MANAGER_TYPES } from "~/lib/drizzle/schema/common";

import { publicProcedure } from "~/server/trpc";
import { getStellarChainConfig } from "./utils";

// Function to convert a string to a bytes32 format
function stringToBytes32(input: string): string {
  // Create a buffer from the input string
  const buffer = Buffer.from(input);
  // Convert to hex and pad to 64 characters (32 bytes)
  return buffer.toString('hex').padStart(64, '0');
}

// Function to convert a decimal string to i128 format
function toI128(amount: string, decimals: number): { hi: string, lo: string } {
  // Convert to BigInt with the correct number of decimals
  const value = BigInt(amount) * BigInt(10 ** decimals);
  // Split into hi and lo parts for i128
  const hi = (value >> 64n).toString();
  const lo = (value & BigInt("0xFFFFFFFFFFFFFFFF")).toString();
  return { hi, lo };
}

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
      
      // InterchainTokenService contract address on Stellar testnet
      const contractAddress = "CATNQHWMG4VOWPSWF4HXVW7ASDJNX7M7F6JLFC544T7ZMMXXAE2HUDTY";
      
      // Create salt from input or generate a random one
      const salt = input.salt || stringToBytes32(randomUUID());
      
      // Fetch the user's account sequence number
      const horizonUrl = 'https://horizon-testnet.stellar.org';
      
      console.log(`Fetching account details for ${input.minterAddress}...`);
      const accountResponse = await fetch(`${horizonUrl}/accounts/${input.minterAddress}`);
      
      if (!accountResponse.ok) {
        throw new Error(`Failed to fetch account details: ${accountResponse.statusText}`);
      }
      
      const accountData = await accountResponse.json();
      const sequenceNumber = accountData.sequence;
      
      console.log(`Sequence number for account ${input.minterAddress}: ${sequenceNumber}`);
      
      // Create a Contract instance
      const contract = new Contract(contractAddress);
      
      // Prepare the token metadata map
      const tokenMetadataMap = [
        new xdr.ScMapEntry({
          key: xdr.ScVal.scvSymbol("decimal"),
          val: xdr.ScVal.scvU32(input.decimals)
        }),
        new xdr.ScMapEntry({
          key: xdr.ScVal.scvSymbol("name"),
          val: xdr.ScVal.scvString(input.name)
        }),
        new xdr.ScMapEntry({
          key: xdr.ScVal.scvSymbol("symbol"),
          val: xdr.ScVal.scvString(input.symbol)
        })
      ];
      
      // Convert initial supply to i128
      const initialSupplyValue = toI128(input.initialSupply, input.decimals);
      
      // Prepare the arguments for the deploy_interchain_token function
      const args = [
        // caller: address
        new Address(input.minterAddress).toScVal(),
        
        // salt: bytesn<32>
        xdr.ScVal.scvBytes(Buffer.from(salt, 'hex')),
        
        // token_metadata: map
        xdr.ScVal.scvMap(tokenMetadataMap),
        
        // initial_supply: i128
        xdr.ScVal.scvI128(new xdr.Int128Parts({
          hi: xdr.Int64.fromString(initialSupplyValue.hi),
          lo: xdr.Uint64.fromString(initialSupplyValue.lo)
        })),
        
        // minter: option<address>
        // If the minter is the same as the caller, we use the caller's address
        new Address(input.minterAddress).toScVal()
      ];
      
      // Create the source account
      const sourceAccount = new Account(input.minterAddress, sequenceNumber);
      
      // Create the transaction
      const transaction = new TransactionBuilder(sourceAccount, {
        fee: "100000", // 0.01 XLM - Soroban transactions require higher fees
        networkPassphrase: Networks.TESTNET, // Passphrase for Stellar testnet
      })
        .addOperation(contract.call("deploy_interchain_token", ...args))
        .setTimeout(30) // 30 seconds timeout
        .build();
      
      // Convert the transaction to XDR format
      const transactionXDR = transaction.toXDR();
      
      // Generate a token ID based on the contract, salt, and caller
      // In a real implementation, this would be returned by the contract
      const tokenId = salt;
      
      // In a real implementation, these would be returned by the contract
      // For now, we'll generate mock addresses
      const tokenAddress = `C${Buffer.from(randomUUID().replace(/-/g, "")).toString("hex").slice(0, 55)}`;
      const tokenManagerAddress = `C${Buffer.from(randomUUID().replace(/-/g, "")).toString("hex").slice(0, 55)}`;
      
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
