import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { hex0x, hex40Literal, hex64Literal } from "~/lib/utils/validation";
import { publicProcedure } from "~/server/trpc";

const remoteTokenSchema = z.object({
  id: z.string(),
  tokenId: z.string(),
  axelarChainId: z.string(),
  tokenAddress: hex40Literal(),
  tokenManagerAddress: hex40Literal().nullable(),
  deploymentMessageId: z.string(),
  deploymentStatus: z.string().nullable(),
  createdAt: z.date().nullable(),
  updatedAt: z.date().nullable(),
});

const outputSchema = z.object({
  tokenId: z.string(),
  tokenAddress: hex40Literal(),
  axelarChainId: z.string(),
  tokenName: z.string(),
  tokenSymbol: z.string(),
  tokenDecimals: z.number(),
  deploymentMessageId: z.string(),
  deployerAddress: hex40Literal(),
  tokenManagerAddress: hex40Literal().nullable(),
  originalMinterAddress: hex40Literal().nullable(),
  kind: z.string(),
  createdAt: z.date().nullable(),
  updatedAt: z.date().nullable(),
  salt: hex64Literal().or(hex0x()),
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
  .input(
    z.object({
      chainId: z.number(),
      tokenAddress: hex40Literal(),
    })
  )
  .query(async ({ input, ctx }) => {
    const chains = await ctx.configs.evmChains();
    const configs = chains[input.chainId];

    const tokenRecord =
      await ctx.persistence.postgres.getInterchainTokenByChainIdAndTokenAddress(
        configs.info.id,
        input.tokenAddress
      );

    if (!tokenRecord) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Interchain token ${input.tokenAddress} not found on chain ${input.chainId}`,
      });
    }

    if (tokenRecord.deployerAddress !== ctx.session?.address) {
      return {
        ...tokenRecord,
        // salt is not returned if the caller is not the deployer
        salt: "0x".concat("0".repeat(64)),
      };
    }

    return tokenRecord;
  });
