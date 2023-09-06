import { invariant } from "@axelarjs/utils";

import { z } from "zod";

import { hex40Literal } from "~/lib/utils/validation";
import { protectedProcedure } from "~/server/trpc";
import type { IntercahinTokenDetails } from "~/services/db/kv";

export const getMyInterchainTokens = protectedProcedure
  .input(
    z.object({
      // only for cache invalidation on account change
      sessionAddress: hex40Literal(),
    })
  )
  .query(async ({ ctx }) => {
    invariant(ctx.session?.address, "Missing session address");

    const kvResult = await ctx.persistence.kv.getAccountInterchainTokens(
      ctx.session?.address
    );

    return kvResult as IntercahinTokenDetails[];
  });
