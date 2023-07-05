import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { hex40, hex64 } from "~/lib/utils/schemas";
import { publicProcedure } from "~/server/trpc";

const tokenDetails = () => ({
  tokenId: hex40(),
  originTokenId: hex40().nullable(),
  tokenAddress: hex64(),
  isOriginToken: z.boolean(),
  isRegistered: z.boolean(),
  chainId: z.number(),
});

export type IntercahinTokenInfo = {
  tokenId: `0x${string}`;
  originTokenId: `0x${string}` | null;
  tokenAddress: `0x${string}`;
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
      tokenAddress: hex64(),
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
  .query(async ({ input }) => {
    try {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Token ${input.tokenAddress} not registered on any chain`,
      });

      // // cache for 1 hour
      // ctx.res.setHeader("Cache-Control", "public, max-age=3600");

      // return result;
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
