import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { publicProcedure } from "~/server/trpc";

const INPUT_SCHEMA = z.object({
  destinationChainId: z.string(),
  sourceChainId: z.string(),
  sourceChainTokenSymbol: z.string().optional(),
  gasLimit: z.number(),
  gasMultiplier: z.union([z.number(), z.literal("auto")]).optional(),
  isGMPExpressTransaction: z.boolean().optional(),
  minGasPrice: z.string().optional(),
  executeData: z.string().optional(),
});

export type EstimateGasFeeInput = z.infer<typeof INPUT_SCHEMA>;

export const estimateGasFee = publicProcedure
  .input(INPUT_SCHEMA)
  .query(async ({ ctx, input }) => {
    try {
      const response = await ctx.services.axelarjsSDK.estimateGasFee({
        destinationChainId: input.destinationChainId,
        sourceChainId: input.sourceChainId,
        sourceChainTokenSymbol: input.sourceChainTokenSymbol,
        gasLimit: input.gasLimit,
        gasMultiplier: input.gasMultiplier,
        isGMPExpressTransaction: input.isGMPExpressTransaction,
        minGasPrice: input.minGasPrice,
        executeData: input.executeData,
      });

      return response;
    } catch (error) {
      // If we get a TRPC error, we throw it
      if (error instanceof TRPCError) {
        throw error;
      }
      // otherwise, we throw an internal server error
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to estimate gas fee",
        cause: error,
      });
    }
  });
