import { z } from "zod";

import { hex40Literal } from "~/lib/utils/schemas";
import { protectedProcedure } from "~/server/trpc";
import type { IntercahinTokenDetails } from "~/services/kv";

export const getInterchainTokenDetails = protectedProcedure
  .input(
    z.object({
      chainId: z.number(),
      tokenAddress: hex40Literal(),
    })
  )
  .query(async ({ input, ctx }) => {
    const kvResult = await ctx.storage.kv.getInterchainTokenDetails({
      chainId: input.chainId,
      tokenAddress: input.tokenAddress,
    });

    if (!kvResult) {
      throw new Error(
        `Interchain token ${input.tokenAddress} not found on chain ${input.chainId}`
      );
    }

    if (kvResult.deployerAddress !== ctx.session?.address) {
      console.log({
        deployerAddress: kvResult.deployerAddress,
        sessionDeployerAddress: ctx.session?.address,
      });
      throw new Error(
        `Invalid deployer address for interchain token ${input.tokenAddress} on chain ${input.chainId}`
      );
    }

    return kvResult as IntercahinTokenDetails;
  });
