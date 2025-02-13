import type { GMPTxStatus } from "@axelarjs/api/gmp";

import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { publicProcedure } from "~/server/trpc";

export type ChainStatus = {
  status: GMPTxStatus;
  txHash: string;
  txId: string;
  logIndex: number;
};

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
    ...["approved", "confirm", "executed"].flatMap((prefix) => [
      `${prefix}.receipt`,
      `${prefix}.topics`,
      `${prefix}.returnValues`,
      `${prefix}.transaction`,
      `${prefix}.created_at`,
    ]),
  ],
};

const INPUT_SCHEMA = z.object({
  txHash: z.string(),
});

async function processGMPData(
  gmpData: any,
  ctx: any
): Promise<[string, ChainStatus]> {
  const { call, callback, status: firstHopStatus } = gmpData;
  const destinationChain = (
    callback?.returnValues.destinationChain ??
    call.returnValues.destinationChain
  ).toLowerCase();

  let status = firstHopStatus;

  // Handle second hop for non-EVM chains
  if (call.chain_type !== "evm" && callback) {
    const secondHopData = await ctx.services.gmp.searchGMP({
      txHash: callback.returnValues.messageId,
      _source: SEARCHGMP_SOURCE,
    });
    status = secondHopData[0].status;
  }

  return [
    destinationChain,
    {
      status,
      txHash: call.transactionHash,
      logIndex: call.logIndex ?? call._logIndex ?? 0,
      txId: gmpData.message_id,
    },
  ];
}

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

      if (!data.length) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Transaction not found",
        });
      }

      // Process all GMP data entries in parallel
      const processedEntries = await Promise.all(
        data.map((gmpData) => processGMPData(gmpData, ctx))
      );

      // Convert the processed entries into a ChainStatusMap
      const result = Object.fromEntries(processedEntries);

      return result;
    } catch (error) {
      if (error instanceof TRPCError) throw error;

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to get transaction status",
      });
    }
  });
