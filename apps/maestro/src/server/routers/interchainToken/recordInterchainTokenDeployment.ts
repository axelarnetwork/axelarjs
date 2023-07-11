import { publicProcedure } from "~/server/trpc";
import { interchainTokenDetailsSchema } from "~/services/kv";

export const recordInterchainTokenDeployment = publicProcedure
  .input(interchainTokenDetailsSchema)
  .mutation(({ ctx, input }) => {
    return ctx.services.kv.setInterchainTokenDetails(
      {
        chainId: input.chainId,
        tokenAddress: input.address,
      },
      input
    );
  });
