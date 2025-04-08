import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { publicProcedure } from "~/server/trpc";

export const getConfigForChain = publicProcedure
  .meta({
    openapi: {
      summary: "Get the full configs for a chain on the Axelar network",
      description:
        "Get the full configs for a chain on the Axelar network, including the assets registered directly on the network",
      method: "GET",
      path: "/axelar-chain-config",
      tags: ["axelar-chain-config"],
    },
  })
  .input(
    z.object({
      axelarChainId: z.string().max(64),
    })
  )
  .output(z.any())
  .query(async ({ ctx, input }) => {
    try {
      return (await ctx.configs.axelarConfigs()).chains[input.axelarChainId];
    } catch (error) {
      // If we get a TRPC error, we throw it
      if (error instanceof TRPCError) {
        throw error;
      }
      // otherwise, we throw an internal server error
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to get chain configs",
      });
    }
  });
