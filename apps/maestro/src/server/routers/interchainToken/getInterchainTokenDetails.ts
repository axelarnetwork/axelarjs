import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { hex40Literal } from "~/lib/utils/validation";
import { protectedProcedure } from "~/server/trpc";
import type { IntercahinTokenDetails } from "~/services/db/kv";

export const getInterchainTokenDetails = protectedProcedure
  .input(
    z.object({
      chainId: z.number(),
      tokenAddress: hex40Literal(),
    })
  )
  .query(async ({ input, ctx }) => {
    const kvResult = await ctx.persistence.kv.getInterchainTokenDetails({
      chainId: input.chainId,
      tokenAddress: input.tokenAddress,
    });

    if (!kvResult) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Interchain token ${input.tokenAddress} not found on chain ${input.chainId}`,
      });
    }

    if (kvResult.deployerAddress !== ctx.session?.address) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: `Invalid deployer address for interchain token ${input.tokenAddress} on chain ${input.chainId}`,
      });
    }

    return kvResult as IntercahinTokenDetails;
  });
