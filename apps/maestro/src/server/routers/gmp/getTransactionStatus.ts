import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { hex40Literal } from "~/lib/utils/validation";
import { publicProcedure } from "~/server/trpc";

/**
 * Get the status of a transaction
 */
export const getTransactionStatus = publicProcedure
  .input(
    z.object({
      txHash: hex40Literal(),
    })
  )
  // a procedure can either be a query or a mutation
  // a query is a read-only operation, a mutation is a write operation
  .query(async ({ input, ctx }) => {
    try {
      const response = await ctx.services.gmp.searchGMP({
        txHash: input.txHash,
      });

      if (response.length) {
        return response[0].status;
      }

      // If we don't find the transaction, we throw a 404 error
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Transaction not found",
      });
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
