import { z } from "zod";
import { randomUUID } from "crypto";
import {
  Account,
  Memo,
  Operation,
  TransactionBuilder
} from "stellar-sdk";

import { TOKEN_MANAGER_TYPES } from "~/lib/drizzle/schema/common";

import { publicProcedure } from "~/server/trpc";
import { getStellarChainConfig } from "./utils";

// Mock function to generate a token ID similar to how it would be done in production
function generateMockTokenId(): string {
  // In production, this would be derived from salt, deployer, etc.
  return `0x${Buffer.from(randomUUID().replace(/-/g, "")).toString("hex").padStart(64, "0")}`;
}

export const getDeployTokenTx = publicProcedure
  .input(
    z.object({
      symbol: z.string(),
      name: z.string(),
      decimals: z.number(),
      initialSupply: z.string(),
      minterAddress: z.string(),
      destinationChainIds: z.array(z.string()),
      gasValues: z.array(z.string()),
    })
  )
  .mutation(async ({ input, ctx }) => {
    try {
      // Get Stellar chain config
      await getStellarChainConfig(ctx); // We're not using this in the mock, but keeping it to simulate real behavior
      
      // Generate mock data
      const tokenId = generateMockTokenId();
      
      // Create a mock token address - in Stellar this would be a contract ID
      // In a real implementation, this would be the actual deployed token contract
      const tokenAddress = `C${Buffer.from(randomUUID().replace(/-/g, "")).toString("hex").slice(0, 55)}`;
      
      // Create a mock token manager address
      const tokenManagerAddress = `C${Buffer.from(randomUUID().replace(/-/g, "")).toString("hex").slice(0, 55)}`;
      
      // Create a simple mock transaction that would represent token creation
      // In a real implementation, this would be the actual transaction to deploy a token
      
      // Buscar o número de sequência atual da conta do usuário
      // Isso é necessário para criar uma transação válida
      const horizonUrl = 'https://horizon-testnet.stellar.org';
      
      // Buscar os detalhes da conta do usuário
      console.log(`Fetching account details for ${input.minterAddress}...`);
      const accountResponse = await fetch(`${horizonUrl}/accounts/${input.minterAddress}`);
      
      if (!accountResponse.ok) {
        throw new Error(`Failed to fetch account details: ${accountResponse.statusText}`);
      }
      
      const accountData = await accountResponse.json();
      const sequenceNumber = accountData.sequence;
      
      console.log(`Sequence number for account ${input.minterAddress}: ${sequenceNumber}`);
      
      // Criar uma conta com o número de sequência correto
      const sourceAccount = new Account(input.minterAddress, sequenceNumber);
      
      // Criar uma transação completa com as operações necessárias
      const transaction = new TransactionBuilder(sourceAccount, {
        fee: "100", // 0.00001 XLM
        networkPassphrase: "Test SDF Network ; September 2015", // Passphrase da testnet do Stellar
      })
        // Adicionar operação para armazenar os metadados do token
        .addOperation(
          Operation.manageData({
            name: `token_${input.symbol.slice(0, 10)}`,
            value: Buffer.from(`${input.symbol}:${input.decimals}`)
          })
        )
        // Adicionar operação para armazenar o nome do token
        .addOperation(
          Operation.manageData({
            name: `name_${input.symbol.slice(0, 10)}`,
            value: Buffer.from(input.name.slice(0, 60))
          })
        )
        // Adicionar um memo com o nome do token
        .addMemo(Memo.text(`Deploy ${input.name} (${input.symbol})`))
        // Definir timeout de 30 segundos
        .setTimeout(30)
        .build();
      
      // Converter a transação para formato XDR
      const transactionXDR = transaction.toXDR();
      
      // Criar os dados do token para incluir na resposta
      const tokenData = {
        symbol: input.symbol,
        name: input.name,
        decimals: input.decimals,
        memoText: `Deploy ${input.name} (${input.symbol})`,
        tokenDataName: `token_${input.symbol.slice(0, 10)}`,
        tokenDataValue: `${input.symbol}:${input.decimals}`,
        nameDataName: `name_${input.symbol.slice(0, 10)}`,
        nameDataValue: input.name.slice(0, 60)
      };
      
      // Return the mock data
      return {
        transactionXDR,
        tokenId,
        tokenAddress,
        tokenManagerAddress,
        tokenManagerType: TOKEN_MANAGER_TYPES[0], // "mint_burn"
        deploymentMessageId: randomUUID(),
        tokenData, // Incluir os dados do token para uso no frontend
      };
    } catch (error) {
      console.error("Error in getDeployTokenTx:", error);
      throw error;
    }
  });
