import { z } from "zod";

import { publicProcedure, router } from "~/server/trpc";

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
});
