import { z } from "zod";

import { hex40Literal } from "~/lib/utils/schemas";
import { protectedProcedure } from "~/server/trpc";
import { remoteInterchainTokenSchema } from "~/services/kv";

export const recordRemoteTokensDeployment = protectedProcedure
  .input(
    z.object({
      chainId: z.number(),
      tokenAddress: hex40Literal(),
      deployerAddress: hex40Literal(),
      remoteTokens: z.array(remoteInterchainTokenSchema),
    })
  )
  // TODO: this needs to be a protected mutation
  .mutation(({ ctx, input }) => {
    ctx.storage.kv.recordRemoteTokensDeployment(
      {
        chainId: input.chainId,
        tokenAddress: input.tokenAddress,
      },
      input.remoteTokens
    );
  });
