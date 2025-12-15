import { z } from "zod";

import { publicProcedure, router } from "~/server/trpc";

const stringOrArray = z.union([z.string(), z.array(z.string())]);

export const solanaRouter = router({
  getDeployTokenTxBytes: publicProcedure
    .input(
      z.object({
        caller: z.string(),
        tokenName: z.string(),
        tokenSymbol: z.string(),
        decimals: z.number(),
        initialSupply: z.string(),
        salt: z.string(),
        minterAddress: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { buildDeployInterchainTokenTxBytes } = await import(
        "./utils/tokenOperations"
      );
      return buildDeployInterchainTokenTxBytes(ctx, input);
    }),

  getRegisterCanonicalInterchainTokenTxBytes: publicProcedure
    .input(
      z.object({
        caller: z.string(),
        tokenAddress: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { buildRegisterCanonicalInterchainTokenTxBytes } = await import(
        "./utils/tokenOperations"
      );
      return buildRegisterCanonicalInterchainTokenTxBytes(ctx, input);
    }),

  getDeployRemoteInterchainTokenTxBytes: publicProcedure
    .input(
      z.object({
        caller: z.string(),
        salt: z.string(),
        destinationChain: stringOrArray,
        gasValue: stringOrArray,
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { buildDeployRemoteInterchainTokenTxBytes } = await import(
        "./utils/tokenOperations"
      );
      return buildDeployRemoteInterchainTokenTxBytes(ctx, input);
    }),

  getDeployRemoteCanonicalInterchainTokenTxBytes: publicProcedure
    .input(
      z.object({
        caller: z.string(),
        tokenAddress: z.string(),
        destinationChain: stringOrArray,
        gasValue: stringOrArray,
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { buildDeployRemoteCanonicalInterchainTokenTxBytes } = await import(
        "./utils/tokenOperations"
      );
      return buildDeployRemoteCanonicalInterchainTokenTxBytes(ctx, input);
    }),

  getInterchainTransferTxBytes: publicProcedure
    .input(
      z.object({
        caller: z.string(),
        tokenId: z.string(),
        tokenAddress: z.string(),
        destinationChain: z.string(),
        destinationAddress: z.string(),
        amount: z.string(),
        gasValue: z.string().default("0"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { buildInterchainTransferTxBytes } = await import(
        "./utils/tokenOperations"
      );
      return buildInterchainTransferTxBytes(ctx, input);
    }),
});
