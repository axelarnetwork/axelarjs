import { z } from "zod";

import { publicProcedure, router } from "~/server/trpc";

import { buildInterchainTransferTxBytes } from "./utils/tokenOperations";

export const xrplRouter = router({
  getInterchainTransferTxBytes: publicProcedure
    .input(
      z.object({
        caller: z.string(),
        tokenId: z.string(),
        tokenAddress: z.string(),
        destinationChain: z.string(),
        destinationAddress: z.string(),
        amount: z.string(),
        gasValue: z.string().default("0"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return buildInterchainTransferTxBytes(ctx, input);
    }),
});