import { z } from "zod";

import { hex40Literal } from "~/lib/utils/schemas";
import { publicProcedure } from "~/server/trpc";

export const signup = publicProcedure
  .input(
    z.object({
      address: hex40Literal(),
    })
  )
  .mutation(async ({ input, ctx }) => {
    const { kv } = ctx.storage;

    const accountDetails = await kv.getAccountDetails(input.address);

    if (!accountDetails) {
      kv.setAccountDetails(input.address, {
        address: input.address,
        nonce: 0,
        interchainTokensIds: [],
      });

      return {
        address: input.address,
        nonce: 0,
      };
    }

    return {
      address: accountDetails.address,
      nonce: accountDetails.nonce,
    };
  });
