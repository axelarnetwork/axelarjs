import type { GasTokenKind } from "@axelarjs/evm";

import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { publicProcedure } from "~/server/trpc";

export const estimateGasFee = publicProcedure
  .input(
    z.object({
      destinationChainId: z.string(),
      sourceChainId: z.string(),
      sourceChainTokenSymbol: z.string(),
      gasLimit: z.number().optional(),
      gasMultipler: z.number().optional(),
      isGMPExpressTransaction: z.boolean().optional(),
      minGasPrice: z.string().optional(),
    })
  )
  .query(async ({ ctx, input }) => {
    try {
      const response = await ctx.services.axelarjsSDK.estimateGasFee({
        destinationChainId: input.destinationChainId,
        sourceChainId: input.sourceChainId,
        sourceChainTokenSymbol: input.sourceChainTokenSymbol as GasTokenKind,
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
        message: "Failed to estimate gas fee",
      });
    }
  });
