import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { publicProcedure } from "~/server/trpc";

export const getChainInfo = publicProcedure
  .meta({
    openapi: {
      summary: "Get chain info for a given chain",
      description:
        "Get chain info for a given chain by providing its chain id on Axelar",
      method: "GET",
      path: "/axelarjs-sdk/chain-info",
      tags: ["axelarjs-sdk"],
    },
  })
  .input(
    z.object({
      axelarChainId: z.string().max(64),
    })
  )
  .output(
    z.object({
      id: z.string(),
      chainName: z.string(),
      blockConfirmations: z.number().optional(),
      estimatedWaitTimeInMinutes: z.number(),
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

      const output = {
        id: chainInfo.id,
        chainName: chainInfo.chainName,
        blockConfirmations: chainInfo.confirmLevel,
        estimatedWaitTimeInMinutes: chainInfo.estimatedWaitTime,
      };

      return output;
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
