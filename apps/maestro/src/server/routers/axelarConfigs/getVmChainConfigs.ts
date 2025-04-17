import { TRPCError } from "@trpc/server";
import { uniqBy } from "rambda";
import { z } from "zod";

import { NEXT_PUBLIC_DISABLED_CHAINS } from "~/config/env";
import { ITSVmChainConfig } from "~/server/chainConfig";
import { publicProcedure } from "~/server/trpc";

export const vmChainConfigSchema = z.custom<ITSVmChainConfig>();

export const getVmChainConfigs = publicProcedure
  .meta({
    openapi: {
      summary: "Get VM chain configs",
      description: "Get VM chain configs",
      method: "GET",
      path: "/vm-chain-configs",
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
  .output(z.array(vmChainConfigSchema))
  .query(async ({ ctx, input }) => {
    try {
      const chainsMap = await ctx.configs.vmChains();
      const chainInfos = Object.values(chainsMap).map((chain) => chain.info);
      const uniqueChainInfos = uniqBy((x) => x.id, chainInfos);
      const validChainInfos = uniqueChainInfos.filter(
        (chain) => vmChainConfigSchema.safeParse(chain).success
      );

      return validChainInfos.filter(
        (chain) =>
          // filter by axelarChainId if provided
          (!input?.axelarChainId || chain.id === input?.axelarChainId) &&
          // filter by chainId if provided
          (!input?.chainId || chain.chain_id === input?.chainId) &&
          // filter out disabled chains
          !NEXT_PUBLIC_DISABLED_CHAINS.includes(chain.id)
      );
    } catch (error) {
      // If we get a TRPC error, we throw it
      if (error instanceof TRPCError) {
        throw error;
      }
      // otherwise, we throw an internal server error
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to get VM chain configs",
      });
    }
  });
