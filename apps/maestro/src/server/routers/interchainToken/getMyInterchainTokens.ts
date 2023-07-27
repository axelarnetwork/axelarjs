import { invariant } from "@axelarjs/utils";

import { protectedProcedure } from "~/server/trpc";
import type { IntercahinTokenDetails } from "~/services/kv";

export const getMyInterchainTokens = protectedProcedure.query(
  async ({ ctx }) => {
    invariant(ctx.session?.address, "Missing session address");

    const kvResult = await ctx.storage.kv.getAccountInterchainTokens(
      ctx.session?.address
    );

    return kvResult as IntercahinTokenDetails[];
  }
);
