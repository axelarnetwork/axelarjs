import type { GMPTxStatus } from "@axelarjs/api/gmp";

import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { publicProcedure } from "~/server/trpc";

export const SEARCHGMP_SOURCE = {
  includes: [
    "call.returnValues.destinationChain",
    "status",
    "approved",
    "confirm",
    "executed",
    "callback",
  ],
  excludes: [
    "call.transaction",
    "fees",
    "gas",
    "gas_price_rate",
    "gas_paid",
    "approved.receipt",
    "confirm.receipt",
    "executed.receipt",
    "approved.topics",
    "approved.returnValues",
    "confirm.returnValues",
    "executed.returnValues",
    "approved.transaction",
    "confirm.transaction",
    "executed.transaction",
    "approved.created_at",
    "confirm.created_at",
    "executed.created_at",
  ],
};

const INPUT_SCHEMA = z.object({
  txHash: z.string(),
});

/**
 * Get the status of an GMP transaction on destination chains
 */
export const getTransactionStatusOnDestinationChains = publicProcedure
  .input(INPUT_SCHEMA)
  .query(async ({ input, ctx }) => {
    try {
      const data = await ctx.services.gmp.searchGMP({
        txHash: input.txHash,
        _source: SEARCHGMP_SOURCE,
      });

      if (data.length) {
        const pendingResult = data.reduce(
          async (acc, gmpData) => {
            const { call, callback, status: firstHopStatus } = gmpData;

            const chainType = gmpData.call.chain_type;
            let secondHopStatus = "pending";

            if (gmpData.callback) {
              const secondHopMessageId =
                gmpData.callback.returnValues.messageId;
              const secondHopData = await ctx.services.gmp.searchGMP({
                txHash: secondHopMessageId,
                _source: SEARCHGMP_SOURCE,
              });

              secondHopStatus = secondHopData[0].status;
            }

            // For 2-hops transaction, the destination chain in callback is the final destination chain, which only exist after the transaction is already executed at the Axelar chain.
            const destinationChain =
              callback?.returnValues.destinationChain?.toLowerCase() ||
              call.returnValues.destinationChain.toLowerCase();

            return {
              ...acc,
              [destinationChain]: {
                status: chainType === "evm" ? firstHopStatus : secondHopStatus,
                txHash: call.transactionHash,
                logIndex: call.logIndex ?? call._logIndex ?? 0,
                txId: gmpData.message_id,
              },
            };
          },
          {} as Promise<{
            [chainId: string]: {
              status: GMPTxStatus;
              txHash: string;
              txId: string;
              logIndex: number;
            };
          }>
        );

        return await pendingResult;
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
