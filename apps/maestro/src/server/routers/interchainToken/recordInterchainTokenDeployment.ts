import { protectedProcedure } from "~/server/trpc";
import { interchainTokenDetailsSchema } from "~/services/kv";

export const recordInterchainTokenDeployment = protectedProcedure
  .input(interchainTokenDetailsSchema)
  .mutation(async ({ ctx, input }) => {
    await ctx.storage.kv.recordInterchainTokenDeployment(
      {
        chainId: input.originChainId,
        tokenAddress: input.tokenAddress,
      },
      input
    );
  });
