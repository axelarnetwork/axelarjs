import { publicProcedure } from "~/server/trpc";

export const getAccountStatuses = publicProcedure.query(async ({ ctx }) => {
  return await ctx.persistence.kv.getAccounStatuses();
});
