import { TRPCError } from "@trpc/server";
import { partition } from "rambda";
import { z } from "zod";

import { EVM_CHAIN_CONFIGS } from "~/config/wagmi";
import { hex40Literal, hex64Literal } from "~/lib/utils/schemas";
import { publicProcedure } from "~/server/trpc";
import type { IntercahinTokenDetails } from "~/services/kv";

const tokenDetails = () => ({
  tokenId: hex64Literal().nullable(),
  tokenAddress: hex40Literal().nullable(),
  isOriginToken: z.boolean(),
  isRegistered: z.boolean(),
  chainId: z.number(),
});

export type IntercahinTokenInfo = {
  tokenId: `0x${string}` | null;
  tokenAddress: `0x${string}` | null;
  isOriginToken: boolean;
  isRegistered: boolean;
  chainId: number;
};

export type SearchInterchainTokenOutput = IntercahinTokenInfo & {
  matchingTokens: IntercahinTokenInfo[];
};

export const searchInterchainToken = publicProcedure
  .meta({
    openapi: {
      summary: "Search for an interchain token",
      description:
        "Search for an interchain token by address, either on a specific chain or on any chain",
      method: "GET",
      path: "/interchain-token/search",
      tags: ["interchain-token"],
    },
  })
  .input(
    z.object({
      chainId: z.number().optional(),
      tokenAddress: hex40Literal(),
    })
  )
  .output(
    z
      .object({
        ...tokenDetails(),
        matchingTokens: z.array(z.object(tokenDetails())),
      })
      .nullable()
  )
  .query(async ({ input, ctx }) => {
    try {
      const [[chainConfig], remainingChainConfigs] = partition(
        (chain) => chain.id === input.chainId,
        EVM_CHAIN_CONFIGS
      );

      if (!chainConfig) {
        // if no chainId is provided, search all chains

        for (const chainConfig of remainingChainConfigs) {
          const kvResult = await ctx.services.kv.getInterchainTokenDetails({
            chainId: chainConfig.id,
            tokenAddress: input.tokenAddress,
          });

          if (!kvResult) {
            continue;
          }
          const result = await getInterchainToken(
            kvResult,
            chainConfig,
            remainingChainConfigs
          );

          // cache for 1 hour
          ctx.res.setHeader("Cache-Control", "public, max-age=3600");

          return result;
        }

        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Token ${input.tokenAddress} not registered on any chain`,
        });
      }

      const kvResult = await ctx.services.kv.getInterchainTokenDetails({
        chainId: chainConfig.id,
        tokenAddress: input.tokenAddress,
      });

      if (!kvResult) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Token ${input.tokenAddress} not registered on chain ${chainConfig.id}`,
        });
      }
      const result = await getInterchainToken(
        kvResult,
        chainConfig,
        remainingChainConfigs
      );

      // cache for 1 hour
      ctx.res.setHeader("Cache-Control", "public, max-age=3600");

      return result;
    } catch (error) {
      // If we get a TRPC error, we throw it
      if (error instanceof TRPCError) {
        throw error;
      }
      // otherwise, we throw an internal server error
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to get InterchainToken details",
        cause: error,
      });
    }
  });

async function getInterchainToken(
  kvResult: IntercahinTokenDetails,
  chainConfig: (typeof EVM_CHAIN_CONFIGS)[number],
  remainingChainConfigs: typeof EVM_CHAIN_CONFIGS
) {
  const lookupToken = {
    tokenId: kvResult.tokenId,
    tokenAddress: kvResult.address,
    isOriginToken: kvResult.chainId === chainConfig.id,
    isRegistered: true,
    chainId: kvResult.chainId,
  };

  const registered = kvResult.remoteTokens.map((token) => ({
    tokenId: kvResult.tokenId,
    tokenAddress: token.address,
    isOriginToken: false,
    isRegistered: true,
    chainId: token.chainId,
  }));

  const unregistered = remainingChainConfigs
    .filter(
      (chain) =>
        chain.id !== chainConfig.id &&
        !kvResult.remoteTokens.some((token) => token.chainId === chain.id)
    )
    .map((chain) => ({
      tokenId: null,
      tokenAddress: null,
      isOriginToken: false,
      isRegistered: false,
      chainId: chain.id,
    }));

  return {
    ...lookupToken,
    matchingTokens: [lookupToken, ...registered, ...unregistered],
  };
}
