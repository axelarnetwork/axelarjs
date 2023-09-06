import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { hex40Literal } from "~/lib/utils/validation";
import { protectedProcedure } from "~/server/trpc";
import { remoteInterchainTokenSchema } from "~/services/db/kv";

export const recordRemoteTokensDeployment = protectedProcedure
  .input(
    z.object({
      chainId: z.number(),
      tokenAddress: hex40Literal(),
      remoteTokens: z.array(remoteInterchainTokenSchema),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const kvRecord = await ctx.persistence.kv.getInterchainTokenDetails({
      chainId: input.chainId,
      tokenAddress: input.tokenAddress,
    });

    if (!kvRecord) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Could not find interchain token details for ${input.tokenAddress} on chain ${input.chainId}`,
      });
    }

    if (kvRecord.deployerAddress !== ctx.session?.address) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: `Only the deployer of the token can record remote tokens`,
      });
    }

    return ctx.persistence.kv.recordRemoteTokensDeployment(
      {
        chainId: input.chainId,
        tokenAddress: input.tokenAddress,
      },
      input.remoteTokens
    );
  });
