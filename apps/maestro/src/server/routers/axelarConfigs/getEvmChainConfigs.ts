import { TRPCError } from "@trpc/server";
import { uniqBy } from "rambda";
import { z } from "zod";

import { NEXT_PUBLIC_DISABLED_CHAINS } from "~/config/env";
import { ITSEvmChainConfig } from "~/server/chainConfig";
import { publicProcedure } from "~/server/trpc";

export const evmChainConfigSchema = z.custom<ITSEvmChainConfig>();

export const getEvmChainConfigs = publicProcedure
  .meta({
    openapi: {
      summary: "Get EVM chain configs",
      description: "Get EVM chain configs",
      method: "GET",
      path: "/evm-chain-configs",
      tags: ["axelar-chain-configs"],
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
      const chains = await ctx.configs.evmChains();
      const chainInfos = Object.values(chains).map((chain) => chain.info);
      const uniqueChainInfos = uniqBy((x) => x.chain_id, chainInfos);
      const validChainInfos = uniqueChainInfos.filter(
        (chain) => evmChainConfigSchema.safeParse(chain).success
      );

      return validChainInfos
        .filter(
          (chain) =>
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
        message: "Failed to get chain configs",
      });
    }
  });
