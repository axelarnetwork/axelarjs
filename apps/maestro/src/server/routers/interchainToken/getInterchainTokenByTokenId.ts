import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { hex64Literal } from "~/lib/utils/validation";
import { publicProcedure } from "~/server/trpc";

export const getInterchainTokenByTokenId = publicProcedure
  .input(
    z.object({
      tokenId: hex64Literal(),
    }),
  )
  .query(async ({ input, ctx }) => {
    const tokenRecord =
      await ctx.persistence.postgres.getInterchainTokenByTokenId(input.tokenId);

    if (!tokenRecord) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Interchain token with tokenId ${input.tokenId} not found`,
      });
    }

    return tokenRecord;
  });
