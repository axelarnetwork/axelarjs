import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { publicProcedure } from "~/server/trpc";

const INPUT_SCHEMA = z.object({
  destinationChainIds: z.array(z.string()),
  sourceChainId: z.string(),
  gasLimit: z.number(),
  gasMultiplier: z.union([z.number(), z.literal("auto")]).optional(),
  isGMPExpressTransaction: z.boolean().optional(),
  minGasPrice: z.string().optional(),
});

export type EstimateGasFeeMultipleChainsInput = z.infer<typeof INPUT_SCHEMA>;

export const estimateGasFeesMultipleChains = publicProcedure
  .input(INPUT_SCHEMA)
  .query(async ({ ctx, input }) => {
    try {
      const response =
        await ctx.services.axelarjsSDK.estimateGasFeeMultipleChains({
          destinationChainIds: input.destinationChainIds,
          sourceChainId: input.sourceChainId,
          gasLimit: input.gasLimit,
          gasMultiplier: input.gasMultiplier,
          isGMPExpressTransaction: input.isGMPExpressTransaction,
          minGasPrice: input.minGasPrice,
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
        message: "Failed to estimate gas fees on multiple chains",
        cause: error,
      });
    }
  });

export type EstimateGasFeeMultipleChainsOutput =
  typeof estimateGasFeesMultipleChains._def._output_out;
