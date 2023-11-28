import { publicProcedure } from "~/server/trpc";
import { messageSchema } from "~/services/db/kv";

export const getGlobalMessage = publicProcedure
  .output(messageSchema.nullable())
  .query(async ({ ctx }) => {
    return await ctx.persistence.kv.getGlobalMessage();
  });
