import { z } from "zod";

import { protectedProcedure } from "~/server/trpc";

export const updateSuiRemoteTokenAddresses = protectedProcedure
  .input(
    z.object({
      tokenId: z.string(),
    })
  )
  .mutation(({ ctx, input }) =>
    ctx.persistence.postgres.updateSuiRemoteTokenAddresses(input.tokenId)
  );
