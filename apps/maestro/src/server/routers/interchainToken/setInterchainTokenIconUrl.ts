import { z } from "zod";

import { hex64Literal } from "~/lib/utils/validation";
import { protectedProcedure } from "~/server/trpc";

export const setInterchainTokenIconUrl = protectedProcedure
  .input(
    z.object({
      iconUrl: z.string().url(),
      tokenId: hex64Literal(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    return await ctx.persistence.kv.setTokenIconUrl(
      input.tokenId,
      input.iconUrl
    );
  });
