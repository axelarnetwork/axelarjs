import { z } from "zod";

import { hex64Literal } from "~/lib/utils/validation";
import { publicProcedure } from "~/server/trpc";

export const getInterchainTokenMeta = publicProcedure
  .input(
    z.object({
      tokenId: hex64Literal(),
    }),
  )
  .query(async ({ ctx, input }) => {
    return await ctx.persistence.kv.getTokenMeta(input.tokenId);
  });
