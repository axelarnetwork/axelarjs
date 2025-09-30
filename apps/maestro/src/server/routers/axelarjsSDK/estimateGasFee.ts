import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { publicProcedure } from "~/server/trpc";

const INPUT_SCHEMA = z.object({
  estimateGasFeeParams: z.object({
    destinationChain: z.string(),
    sourceChain: z.string(),
    sourceChainTokenSymbol: z.string().optional(),
    gasLimit: z.number(),
    /** Will be used for the API request, and it only affects the execution fee */
    gasMultiplier: z.union([z.number(), z.literal("auto")]).optional(),
    isGMPExpressTransaction: z.boolean().optional(),
    minGasPrice: z.string().optional(),
    executeData: z.string().optional(),
  }),

  /** Multiplies the final result of the gas fee */
  totalFeeMultiplier: z.number().optional(),
});

export type EstimateGasFeeInput = z.infer<typeof INPUT_SCHEMA>;

export const estimateGasFee = publicProcedure
  .input(INPUT_SCHEMA)
  .query(async ({ ctx, input }) => {
    try {
      const response = await ctx.services.axelarjsSDK.estimateGasFee({
        estimateGasFeeParams: input.estimateGasFeeParams,
        totalFeeMultiplier: input.totalFeeMultiplier,
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
