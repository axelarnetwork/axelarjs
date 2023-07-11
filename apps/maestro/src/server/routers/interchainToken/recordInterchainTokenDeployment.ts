import { publicProcedure } from "~/server/trpc";
import { interchainTokenDetailsSchema } from "~/services/kv";

export const recordInterchainTokenDeployment = publicProcedure
  .input(interchainTokenDetailsSchema)
  .mutation(({ ctx, input }) => {
    ctx.services.kv.setInterchainTokenDetails(input.address, input);
  });
