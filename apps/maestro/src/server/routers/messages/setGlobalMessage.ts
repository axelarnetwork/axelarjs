import { publicProcedure } from "~/server/trpc";
import { messageSchema } from "~/services/db/kv";

export const setGlobalMessage = publicProcedure
  .input(messageSchema)
  .mutation(async ({ ctx, input }) => {
    return await ctx.persistence.kv.setGlobalMessage(input);
  });
