import { z } from "zod";

import { protectedProcedure } from "~/server/trpc";

export const getInterchainTokens = protectedProcedure
  .input(
    z.object({
      limit: z.number().optional().default(10),
      offset: z.number().optional().default(0),
    })
  )
  .query(async ({ ctx, input }) => {
    const tokenRecords =
      await ctx.persistence.postgres.getAllDeployedInterchainTokens();

    const sorted = tokenRecords.sort(
      // sort by creation date newest to oldest
      (a, b) => Number(b.createdAt?.getTime()) - Number(a.createdAt?.getTime())
    );

    const totalPages = Math.ceil(sorted.length / input.limit);
    const pageIndex = Math.floor(input.offset / input.limit);

    // return paginated results
    const items = sorted.slice(input.offset, input.offset + input.limit);

    const totalItems = sorted.length;

    return {
      items,
      totalItems,
      totalPages,
      pageIndex,
      pageSize: input.limit,
    };
  });
