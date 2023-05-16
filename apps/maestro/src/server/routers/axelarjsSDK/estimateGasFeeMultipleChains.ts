import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { publicProcedure } from "~/server/trpc";

export const estimateGasFeesMultipleChains = publicProcedure
  .input(
    z.object({
      destinationChainIds: z.array(z.string()),
      sourceChainId: z.string(),
      gasLimit: z.number().optional(),
      gasMultipler: z.number().optional(),
      isGMPExpressTransaction: z.boolean().optional(),
      minGasPrice: z.string().optional(),
    })
  )
  .query(async ({ ctx, input }) => {
    try {
      const response =
        await ctx.services.axelarjsSDK.estimateGasFeeMultipleChains({
          destinationChainIds: input.destinationChainIds,
          sourceChainId: input.sourceChainId,
          gasLimit: input.gasLimit,
          gasMultipler: input.gasMultipler,
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
      });
    }
  });
