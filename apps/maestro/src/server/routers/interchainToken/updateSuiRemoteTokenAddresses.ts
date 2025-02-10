import { z } from "zod";

import { protectedProcedure } from "~/server/trpc";

export const updateSuiRemoteTokenAddresses = protectedProcedure
  .input(
    z.object({
      tokenId: z.string(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    return ctx.persistence.postgres.updateSuiRemoteTokenAddresses(
      input.tokenId
    );
  });
