import { z } from "zod";

import { hex64Literal } from "~/lib/utils/schemas";
import { publicProcedure } from "~/server/trpc";
import { interchainTokenDetailsSchema } from "~/services/kv";

export const getInterchainTokenABI = publicProcedure
  .input(
    z.object({
      tokenAddress: hex64Literal(),
      details: interchainTokenDetailsSchema,
    })
  )
  .mutation(({ ctx, input }) => {
    ctx.services.kv.setInterchainTokenDetails(
      input.tokenAddress,
      input.details
    );
  });
