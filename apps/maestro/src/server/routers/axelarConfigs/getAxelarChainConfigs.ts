import { ChainConfig } from "@axelarjs/api";

import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { publicProcedure } from "~/server/trpc";

export const AxelarChainConfigResponse = z.record(z.string(), z.custom<ChainConfig>()); // Using z.custom as ChainConfig is an interface/type, not a Zod schema
export const getAxelarChainConfigs = publicProcedure
  .meta({
    openapi: {
      summary: "Get chain configs",
      description: "Get chain configs",
      method: "GET",
      path: "/axelar-chain-configs",
      tags: ["axelar-chain-configs"],
    },
  })
  .output(AxelarChainConfigResponse) // Using z.custom as ChainConfig is an interface/type, not a Zod schema
  .query(async ({ ctx }) => {
    try {
      const chains = (await ctx.configs.axelarConfigs()).chains;
      const eligibleChains = Object.keys(chains)
        .map((key) => chains[key])
        .filter((chain) => chain.chainType !== "axelarnet");

      const records: Record<string, ChainConfig> = {};

      for (const chain of eligibleChains) {
        records[chain.id] = chain;
      }

      return records;
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
