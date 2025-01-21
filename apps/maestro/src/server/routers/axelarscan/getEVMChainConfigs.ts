import { TRPCError } from "@trpc/server";
import { uniqBy } from "rambda";
import { z } from "zod";

import { NEXT_PUBLIC_DISABLED_CHAINS } from "~/config/env";
import { publicProcedure } from "~/server/trpc";

const evmChainConfigSchema = z.object({
  id: z.string(),
  deprecated: z.boolean().optional(),
  chain_id: z.number(),
  chain_name: z.string(),
  maintainer_id: z.string(),
  name: z.string(),
  image: z.string(),
  color: z.string(),
  chain_type: z.string(),
  no_inflation: z.boolean(),
  no_tvl: z.boolean().optional(),
  endpoints: z.object({
    rpc: z.array(z.string()),
  }),
  native_token: z.object({
    name: z.string(),
    symbol: z.string(),
    decimals: z.number(),
  }),
  explorer: z.object({
    name: z.string(),
    url: z.string(),
    icon: z.string(),
    block_path: z.string(),
    address_path: z.string(),
    contract_path: z.string(),
    contract_0_path: z.string().optional(),
    transaction_path: z.string(),
  }),
  provider_params: z.array(
    z.object({
      chainId: z.string(),
      chainName: z.string(),
      rpcUrls: z.array(z.string()),
      nativeCurrency: z.object({
        name: z.string(),
        symbol: z.string(),
        decimals: z.number(),
      }),
      blockExplorerUrls: z.array(z.string()),
    })
  ),
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
