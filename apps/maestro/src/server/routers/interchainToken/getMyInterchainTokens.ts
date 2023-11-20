import { invariant } from "@axelarjs/utils";

import { z } from "zod";

import { hex40Literal } from "~/lib/utils/validation";
import { protectedProcedure } from "~/server/trpc";

export const getMyInterchainTokens = protectedProcedure
  .input(
    z.object({
      // only for cache invalidation on account change
      sessionAddress: hex40Literal(),
    })
  )
  .query(async ({ ctx }) => {
    invariant(ctx.session?.address, "Missing session address");

    const tokenRecords =
      await ctx.persistence.postgres.getInterchainTokensByDeployerAddress(
        ctx.session?.address
      );

    return tokenRecords;
  });
