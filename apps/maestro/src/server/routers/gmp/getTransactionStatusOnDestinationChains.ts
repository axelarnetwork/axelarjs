import type { GMPTxStatus } from "@axelarjs/api/gmp";

import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { hex64Literal } from "~/lib/utils/validation";
import { publicProcedure } from "~/server/trpc";

/**
 * Get the status of an GMP transaction on destination chains
 */
export const getTransactionStatusOnDestinationChains = publicProcedure
  .input(
    z.object({
      txHash: hex64Literal(),
    })
  )
  .query(async ({ input, ctx }) => {
    try {
      const data = await ctx.services.gmp.searchGMP({
        txHash: input.txHash,
        // _source: {
        //   includes: ["call.returnValues.destinationChain", "status"],
        // },
      });

      if (data.length) {
        const result = data.reduce(
          (acc, { call, status }) => ({
            ...acc,
            [call.returnValues.destinationChain.toLowerCase()]: status,
          }),
          {} as { [chainId: string]: GMPTxStatus }
        );

        return result;
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
