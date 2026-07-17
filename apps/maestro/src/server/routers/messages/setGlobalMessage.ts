import { disabledProcedure } from "~/server/trpc";
import { messageSchema } from "~/services/db/kv";

export const setGlobalMessage = disabledProcedure
  .input(messageSchema)
  .mutation(async ({ ctx, input }) => {
    return await ctx.persistence.kv.setGlobalMessage(input);
  });
