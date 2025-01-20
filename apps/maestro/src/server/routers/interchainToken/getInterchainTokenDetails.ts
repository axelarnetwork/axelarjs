import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { TOKEN_MANAGER_TYPES } from "~/lib/drizzle/schema/common";
import { hex0xLiteral, hex64Literal } from "~/lib/utils/validation";
import { publicProcedure } from "~/server/trpc";

const remoteTokenSchema = z.object({
  id: z.string(),
  tokenId: z.string(),
  axelarChainId: z.string(),
  tokenAddress: z.string(),
  tokenManagerAddress: z.string().nullable(),
  tokenManagerType: z.enum(TOKEN_MANAGER_TYPES).nullable(),
  deploymentMessageId: z.string(),
  deploymentStatus: z.string().nullable(),
  createdAt: z.date().nullable(),
  updatedAt: z.date().nullable(),
});

export const inputSchema = z.object({
  chainId: z.number(),
  tokenAddress: z.string(),
});

const outputSchema = z.object({
  tokenId: z.string(),
  tokenAddress: z.string(),
  axelarChainId: z.string(),
  tokenName: z.string(),
  tokenSymbol: z.string(),
  tokenDecimals: z.number(),
  deploymentMessageId: z.string(),
  deployerAddress: z.string(),
  tokenManagerAddress: z.string().nullable(),
  tokenManagerType: z.enum(TOKEN_MANAGER_TYPES).nullable(),
  originalMinterAddress: z.string().nullable(),
  kind: z.string(),
  createdAt: z.date().nullable(),
  updatedAt: z.date().nullable(),
  salt: hex64Literal().or(hex0xLiteral()),
  remoteTokens: z.array(remoteTokenSchema),
});

export const getInterchainTokenDetails = publicProcedure
  .meta({
    openapi: {
      summary: "Get token details for an interchain token",
      description:
        "Get the details for an interchain token by address and chain ID",
      method: "GET",
      path: "/interchain-token/details",
      tags: ["interchain-token"],
    },
  })
  .output(outputSchema)
  .input(inputSchema)
  .query(async ({ input, ctx }) => {
    // Get both EVM and VM chains
    const [evmChains, vmChains] = await Promise.all([
      ctx.configs.evmChains(),
      ctx.configs.vmChains(),
    ]);

    // Combine chains and look for config
    const configs = evmChains[input.chainId] || vmChains[input.chainId];

    // TODO: remove this once we have sui in the chains object
    const axelarChainId = input.chainId === 103 ? "sui" : configs.info.id;
    // if (!configs) {
    //   throw new TRPCError({
    //     code: "NOT_FOUND",
    //     message: `Chain configuration not found for chain ID ${input.chainId}`,
    //   });
    // }

    const tokenRecord =
      await ctx.persistence.postgres.getInterchainTokenByChainIdAndTokenAddress(
        axelarChainId,
        input.tokenAddress
      );

    if (!tokenRecord) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Interchain token ${input.tokenAddress} not found on chain ${input.chainId}`,
      });
    }

    return tokenRecord;
  });
