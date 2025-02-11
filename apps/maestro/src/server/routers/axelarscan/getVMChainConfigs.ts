import { TRPCError } from "@trpc/server";
import { uniqBy } from "rambda";
import { z } from "zod";

import { NEXT_PUBLIC_DISABLED_CHAINS } from "~/config/env";
import { publicProcedure } from "~/server/trpc";

const vmChainConfigSchema = z.object({
  id: z.string(),
  chain_name: z.string(),
  chain_id: z.number().optional(),
  maintainer_id: z.string().optional(),
  multisig_prover: z.object({
    address: z.string(),
  }),
  voting_verifier: z.object({
    address: z.string(),
  }),
  name: z.string(),
  short_name: z.string(),
  image: z.string(),
  color: z.string(),
  chain_type: z.literal("vm"), 
  no_inflation: z.boolean().optional(),
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
  ).optional(),
});

export const getVMChainConfigs = publicProcedure
  .meta({
    openapi: {
      summary: "Get VM chain configs",
      description: "Get VM chain configs",
      method: "GET",
      path: "/chain-configs/vm",
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
  .output(z.array(vmChainConfigSchema))
  .query(async ({ ctx, input }) => {
    try {
      const chainsMap = await ctx.configs.vmChains();
      const chainInfos = Object.values(chainsMap).map((chain) => chain.info);
      const uniqueChainInfos = uniqBy((x) => x.id, chainInfos);
      const validChainInfos = uniqueChainInfos.filter(
        (chain) => vmChainConfigSchema.safeParse(chain).success
      );

      return validChainInfos
        .filter(
          (chain) =>
            // filter by axelarChainId if provided
            (!input?.axelarChainId || chain.id === input?.axelarChainId) &&
            // filter by chainId if provided
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
        message: "Failed to get VM chain config",
      });
    }
  });
