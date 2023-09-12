import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { NEXT_PUBLIC_INTERCHAIN_TOKEN_SERVICE_ADDRESS } from "~/config/env";
import { publicProcedure } from "~/server/trpc";

/**
 * Get the most recent transactions for the current user
 */
export const getRecentTransactions = publicProcedure
  .input(
    z.object({
      size: z.number().default(10),
    })
  )
  .output(
    z.array(
      z.object({
        hash: z.string(),
        blockHash: z.string(),
        status: z.string(),
      })
    )
  )
  .meta({
    openapi: {
      summary: "Get the most recent transactions for the current user",
      method: "GET",
      path: "/gmp/recent-transactions",
      tags: ["gmp"],
    },
  })
  .query(async ({ input, ctx }) => {
    try {
      const response = await ctx.services.gmp.searchGMP({
        senderAddress: ctx.session?.address,
        destinationContractAddress:
          NEXT_PUBLIC_INTERCHAIN_TOKEN_SERVICE_ADDRESS,
        size: input.size,
      });

      return response.map(({ call, status }) => ({
        status,
        hash: call.transactionHash,
        blockHash: call.blockHash,
      }));
    } catch (error) {
      // If we get a TRPC error, we throw it
      if (error instanceof TRPCError) {
        throw error;
      }
      // otherwise, we throw an internal server error
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to get transaction status",
      });
    }
  });
