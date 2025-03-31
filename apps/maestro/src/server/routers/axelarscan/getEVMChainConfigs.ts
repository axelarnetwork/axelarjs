import { TRPCError } from "@trpc/server";
import { uniqBy } from "rambda";
import { z } from "zod";

import { NEXT_PUBLIC_DISABLED_CHAINS } from "~/config/env";
import { publicProcedure } from "~/server/trpc";
import { baseChainConfigSchema } from "~/server/types";

const evmChainConfigSchema = baseChainConfigSchema.extend({
  chain_id: z.number(),
  chainType: z.literal("evm"),
});

export const getEVMChainConfigs = publicProcedure
  .meta({
    openapi: {
      summary: "Get EVM chain configs",
      description: "Get EVM chain configs",
      method: "GET",
      path: "/chain-configs/evm",
      tags: ["chain-configs"],
    },
  })
  .input(
    z
      .object({
        axelarChainId: z.string().max(64).optional(),
        chainId: z.number().optional(),
      })
      .optional()
  )
  .output(z.array(evmChainConfigSchema))
  .query(async ({ ctx, input }) => {
    try {
      const chainsMap = await ctx.configs.evmChains();
      chainsMap.axelarnetwork = chainsMap.axelarnetwork || {};
      const chainInfos = Object.values(chainsMap).map((chain) => chain.info);
      const uniqueChainInfos = uniqBy((x) => x.chain_id, chainInfos);
      const validChainInfos = uniqueChainInfos.filter(
        (chain) => evmChainConfigSchema.safeParse(chain).success
      );

      return validChainInfos
        .filter(
          (chain) =>
            !chain.deprecated &&
            // filter also by axelarChainId if provided
            (!input?.axelarChainId || chain.id === input?.axelarChainId) &&
            // filter also by chainId if provided
            (!input?.chainId || chain.chain_id === input?.chainId) &&
            // filter out disabled chains
            !NEXT_PUBLIC_DISABLED_CHAINS.includes(chain.id)
        )
        .sort((a, b) => a.name.localeCompare(b.name));
    } catch (error) {
      // If we get a TRPC error, we throw it
      if (error instanceof TRPCError) {
        throw error;
      }
      // otherwise, we throw an internal server error
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to get chain config",
      });
    }
  });
