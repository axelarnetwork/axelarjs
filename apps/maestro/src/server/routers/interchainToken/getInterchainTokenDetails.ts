import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { hex40Literal } from "~/lib/utils/validation";
import { publicProcedure } from "~/server/trpc";
import {
  interchainTokenDetailsSchema,
  type IntercahinTokenDetails,
} from "~/services/db/kv";

export const getInterchainTokenDetails = publicProcedure
  .meta({
    openapi: {
      summary: "Get interchain token details",
      description: "Get interchain token details by chainId and tokenAddress.",
      method: "GET",
      path: "/interchain-token/details",
      tags: ["interchain-token"],
    },
  })
  .input(
    z.object({
      chainId: z.number(),
      tokenAddress: hex40Literal(),
    })
  )
  .output(interchainTokenDetailsSchema)
  .query(async ({ input, ctx }): Promise<IntercahinTokenDetails> => {
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
      return {
        ...kvResult,
        salt: "0x".concat("0".repeat(64)),
      } as IntercahinTokenDetails;
    }

    return kvResult;
  });
