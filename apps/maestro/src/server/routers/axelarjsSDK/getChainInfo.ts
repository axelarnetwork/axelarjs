import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { publicProcedure } from "~/server/trpc";

export const ETH_AVG_BLOCK_TIME_SECONDS = 15;

export const getChainInfo = publicProcedure
  .input(
    z.object({
      axelarChainId: z.string(),
    })
  )
  .query(async ({ ctx, input }) => {
    try {
      const chainInfo = await ctx.services.axelarjsSDK.getChainInfo({
        axelarChainId: input.axelarChainId,
      });

      if (!chainInfo) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Could not find chain info for ${input.axelarChainId}`,
        });
      }

      return chainInfo;
    } catch (error) {
      // If we get a TRPC error, we throw it
      if (error instanceof TRPCError) {
        throw error;
      }
      // otherwise, we throw an internal server error
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to get chain info",
      });
    }
  });
