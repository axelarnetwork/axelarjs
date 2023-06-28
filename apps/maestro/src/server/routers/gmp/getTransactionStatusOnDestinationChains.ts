import type { GMPTxStatus } from "@axelarjs/api/gmp";

import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { logger } from "~/lib/logger";
import { hex40 } from "~/lib/utils/schemas";
import { publicProcedure } from "~/server/trpc";

/**
 * Get the status of an interchain token deployment
 */
export const getTransactionStatusOnDestinationChains = publicProcedure
  // a procedure must have a schema for input validation, we use zod for this: https://zod.dev/
  .input(
    z.object({
      txHash: hex40(),
    })
  )
  // a procedure can either be a query or a mutation
  // a query is a read-only operation, a mutation is a write operation
  .query(async ({ input, ctx }) => {
    try {
      logger.info(`getTransactionStatusOnDestinationChains: ${input.txHash}`);
      const data = await ctx.services.gmp.searchGMP({
        txHash: input.txHash as `0x${string}`,
      });
      logger.info(`getTransactionStatusOnDestinationChains: ${data}`);

      if (data.length) {
        return data.reduce(
          (acc, { call, status }) => ({
            ...acc,
            [call.returnValues.destinationChain.toLowerCase()]: status,
          }),
          {} as { [chainId: string]: GMPTxStatus }
        );
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
