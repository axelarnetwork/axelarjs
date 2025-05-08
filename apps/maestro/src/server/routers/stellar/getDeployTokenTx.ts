import { z } from "zod";
import { randomUUID, createHash } from "crypto";
import {
  Account,
  Address,
  Contract,
  Networks,
  TransactionBuilder,
  BASE_FEE,
  rpc,
  xdr,
  nativeToScVal
} from "stellar-sdk";

import { TOKEN_MANAGER_TYPES } from "~/lib/drizzle/schema/common";

import { publicProcedure } from "~/server/trpc";
import { getStellarChainConfig } from "./utils";

// Function to convert a string to a bytes32 format
function saltToBytes32(input: string): string {
  // If it's already a hex string, ensure it's properly formatted
  if (/^(0x)?[0-9a-fA-F]+$/.test(input)) {
    // Remove 0x prefix if present
    const cleanHex = input.startsWith('0x') ? input.slice(2) : input;
    // Pad to 64 characters (32 bytes)
    return cleanHex.padStart(64, '0');
  }
  
  // Otherwise, create a hash from the input
  const hash = createHash('sha256').update(input).digest('hex');
  return hash;
}

// Function to convert hex string to ScVal bytes
function hexToScVal(hexString: string): xdr.ScVal {
  const cleanHex = hexString.startsWith('0x') ? hexString.slice(2) : hexString;
  return xdr.ScVal.scvBytes(Buffer.from(cleanHex, 'hex'));
}

// Function to create token metadata map
function tokenMetadataToScVal(decimal: number, name: string, symbol: string): xdr.ScVal {
  // Create map entries with key-value pairs
  const decimalEntry = new xdr.ScMapEntry({
    key: xdr.ScVal.scvSymbol('decimal'),
    val: nativeToScVal(decimal, { type: 'u32' })
  });
  
  const nameEntry = new xdr.ScMapEntry({
    key: xdr.ScVal.scvSymbol('name'),
    val: nativeToScVal(name, { type: 'string' })
  });
  
  const symbolEntry = new xdr.ScMapEntry({
    key: xdr.ScVal.scvSymbol('symbol'),
    val: nativeToScVal(symbol, { type: 'string' })
  });
  
  // Return the complete map
  return xdr.ScVal.scvMap([decimalEntry, nameEntry, symbolEntry]);
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
      const salt = input.salt || saltToBytes32(randomUUID());
      
      console.log(`Processing token deployment with parameters:`);
      console.log(`Symbol: ${input.symbol}`);
      console.log(`Name: ${input.name}`);
      console.log(`Decimals: ${input.decimals}`);
      console.log(`Initial Supply: ${input.initialSupply}`);
      console.log(`Salt: ${salt}`);
      console.log(`Minter Address: ${input.minterAddress}`);
      
      // Fetch the user's account
      const horizonUrl = 'https://horizon-testnet.stellar.org';
      const rpcUrl = 'https://soroban-testnet.stellar.org:443';
      
      console.log(`Fetching account details for ${input.minterAddress}...`);
      const accountResponse = await fetch(`${horizonUrl}/accounts/${input.minterAddress}`);
      
      if (!accountResponse.ok) {
        throw new Error(`Failed to fetch account details: ${accountResponse.statusText}`);
      }
      
      const accountData = await accountResponse.json();
      const account = new Account(input.minterAddress, accountData.sequence);
      
      console.log(`Account sequence number: ${accountData.sequence}`);
      
      // Create a Contract instance
      const contract = new Contract(contractAddress);
      
      // Create RPC server instance for preparing the transaction
      const server = new rpc.Server(rpcUrl, {
        allowHttp: rpcUrl.includes('localhost') || rpcUrl.includes('127.0.0.1')
      });
      
      // Prepare the operation arguments
      const caller = new Address(input.minterAddress).toScVal();
      const minter = caller; // Using the same address as both caller and minter
      
      // Create the operation using the contract.call method
      console.log('Creating deploy_interchain_token operation...');
      const operation = contract.call(
        'deploy_interchain_token',
        caller,
        hexToScVal(salt),
        tokenMetadataToScVal(input.decimals, input.name, input.symbol),
        nativeToScVal(input.initialSupply, { type: 'i128' }),
        minter
      );
      
      // Build the transaction
      console.log('Building transaction...');
      const builtTransaction = new TransactionBuilder(account, {
        fee: BASE_FEE,
        networkPassphrase: Networks.TESTNET,
      })
        .addOperation(operation)
        .setTimeout(30)
        .build();
      
      // Get the XDR before preparing
      const xdrBeforePrepare = builtTransaction.toEnvelope().toXDR('base64');
      console.log('XDR before preparing:', xdrBeforePrepare);
      
      // Prepare the transaction (simulate and discover storage footprint)
      console.log('Preparing transaction...');
      let preparedTransaction;
      try {
        preparedTransaction = await server.prepareTransaction(builtTransaction);
        console.log('Transaction prepared successfully');
      } catch (error) {
        console.error('Error preparing transaction:', error);
        throw error;
      }
      
      // Get the final XDR
      const transactionXDR = preparedTransaction.toEnvelope().toXDR('base64');
      console.log('Final XDR generated successfully');
      
      // Generate a token ID based on the salt
      const tokenId = salt;
      
      // Generate mock addresses for token and token manager
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
