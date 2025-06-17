import { z } from "zod";

import { publicProcedure, router } from "~/server/trpc";
import { buildRegisterCanonicalTokenTransaction } from "./utils/canonicalTokenRegistration";
import { buildInterchainTransferTransaction } from "./utils/interchainTransfer";
import { buildDeployRemoteInterchainTokensTransaction } from "./utils/remoteTokenDeployments";
import {
  buildDeployAndRegisterRemoteInterchainTokenTransaction,
  buildDeployInterchainTokenTransaction,
} from "./utils/tokenDeployments";
import { buildMintTokenTransaction } from "./utils/tokenMint";

export const stellarRouter = router({
  // Endpoint to get transaction bytes for deploying a token on Stellar
  getDeployTokenTxBytes: publicProcedure
    .input(
      z.object({
        caller: z.string(), // Caller address
        tokenName: z.string(),
        tokenSymbol: z.string(),
        decimals: z.number(),
        initialSupply: z.string(), // Bigint as string
        salt: z.string(), // Hex string
        minterAddress: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      // Use the utility function to build the transaction
      const { transactionXDR } = await buildDeployInterchainTokenTransaction({
        caller: input.caller,
        tokenName: input.tokenName,
        tokenSymbol: input.tokenSymbol,
        decimals: input.decimals,
        initialSupply: input.initialSupply,
        salt: input.salt,
        minterAddress: input.minterAddress,
      });

      return {
        transactionXDR,
      };
    }),

  // Endpoint to get transaction bytes for deploying tokens to remote chains
  getDeployRemoteTokensTxBytes: publicProcedure
    .input(
      z.object({
        caller: z.string(), // Caller address
        salt: z.string(), // Hex string
        destinationChainIds: z.array(z.string()),
        gasValues: z.array(z.string()), // Array of bigint as strings
        minterAddress: z.string().optional(),
        multicallContractAddress: z.string().optional(),
        gasTokenAddress: z.string().optional(),
        itsContractAddress: z.string().optional(),
        isCanonical: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      // Use the utility function to build the remote deployment transaction
      const { transactionXDR } =
        await buildDeployRemoteInterchainTokensTransaction({
          caller: input.caller,
          salt: input.salt,
          destinationChainIds: input.destinationChainIds,
          gasValues: input.gasValues,
          minterAddress: input.minterAddress,
          multicallContractAddress: input.multicallContractAddress,
          gasTokenAddress: input.gasTokenAddress,
          itsContractAddress: input.itsContractAddress,
          isCanonical: input.isCanonical,
        });

      return {
        transactionXDR,
      };
    }),

  // Endpoint to get transaction bytes for interchain token transfer
  getSendTokenTxBytes: publicProcedure
    .input(
      z.object({
        caller: z.string(), // Caller address
        tokenId: z.string(), // Token ID
        destinationChain: z.string(), // Destination chain name
        destinationAddress: z.string(), // Destination address
        amount: z.number(), // Amount to transfer
        gasValue: z.number(), // Gas payment value
      })
    )
    .mutation(async ({ input }) => {
      // Use the utility function to build the interchain transfer transaction
      const { transactionXDR } = await buildInterchainTransferTransaction({
        caller: input.caller,
        tokenId: input.tokenId,
        destinationChain: input.destinationChain,
        destinationAddress: input.destinationAddress,
        amount: input.amount,
        gasValue: input.gasValue,
      });

      return {
        transactionXDR,
      };
    }),

  // Endpoint to get transaction bytes for registering a canonical token on Stellar
  getRegisterCanonicalTokenTxBytes: publicProcedure
    .input(
      z.object({
        caller: z.string(),
        tokenAddress: z.string(),
        destinationChainIds: z.array(z.string()),
        gasValues: z.array(z.string()),
        multicallContractAddress: z.string().optional(),
        gasTokenAddress: z.string().optional(),
        itsContractAddress: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { transactionXDR, isTokenRegistered } =
        await buildRegisterCanonicalTokenTransaction({
          caller: input.caller,
          tokenAddress: input.tokenAddress,
          destinationChainIds: input.destinationChainIds,
          gasValues: input.gasValues,
          multicallContractAddress: input.multicallContractAddress,
          gasTokenAddress: input.gasTokenAddress,
          itsContractAddress: input.itsContractAddress,
        });

      return {
        transactionXDR,
        isTokenRegistered,
      };
    }),

  // Endpoint to get transaction bytes for minting tokens on Stellar
  getMintTokenTxBytes: publicProcedure
    .input(
      z.object({
        caller: z.string(),
        toAddress: z.string(),
        tokenAddress: z.string(),
        amount: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      // Use the utility function to build the mint transaction
      const { transactionXDR } = await buildMintTokenTransaction({
        caller: input.caller,
        toAddress: input.toAddress,
        tokenAddress: input.tokenAddress,
        amount: input.amount,
      });

      return {
        transactionXDR,
      };
    }),

  // Endpoint to get transaction bytes for deploying and registering an interchain token in a single transaction
  getDeployAndRegisterRemoteTokenTxBytes: publicProcedure
    .input(
      z.object({
        caller: z.string(),
        tokenName: z.string(),
        tokenSymbol: z.string(),
        decimals: z.number(),
        initialSupply: z.string(),
        salt: z.string(),
        minterAddress: z.string().optional(),
        destinationChainIds: z.array(z.string()),
        gasValues: z.array(z.string()),
        multicallContractAddress: z.string().optional(),
        gasTokenAddress: z.string().optional(),
        itsContractAddress: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      // Use the utility function to build the combined deployment and registration transaction
      const { transactionXDR } =
        await buildDeployAndRegisterRemoteInterchainTokenTransaction({
          caller: input.caller,
          tokenName: input.tokenName,
          tokenSymbol: input.tokenSymbol,
          decimals: input.decimals,
          initialSupply: input.initialSupply,
          salt: input.salt,
          minterAddress: input.minterAddress,
          destinationChainIds: input.destinationChainIds,
          gasValues: input.gasValues,
          multicallContractAddress: input.multicallContractAddress,
          gasTokenAddress: input.gasTokenAddress,
          itsContractAddress: input.itsContractAddress,
        });

      return {
        transactionXDR,
      };
    }),
});
