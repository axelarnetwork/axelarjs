import { publicProcedure } from "~/server/trpc";
import { interchainTokenDetailsSchema } from "~/services/kv";

export const recordInterchainTokenDeployment = publicProcedure
  .input(interchainTokenDetailsSchema)
  // TODO: this needs to be a protected mutation
  .mutation(async ({ ctx, input }) => {
    // first record the token details
    await ctx.services.kv.recordInterchainTokenDeployment(
      {
        chainId: input.originChainId,
        tokenAddress: input.tokenAddress,
      },
      input
    );
  });
