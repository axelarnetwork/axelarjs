import type { GMPTxStatus } from "@axelarjs/api";

import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { hex64Literal } from "~/lib/utils/validation";
import { publicProcedure } from "~/server/trpc";
import { SEARCHGMP_SOURCE, ChainStatus } from "./getTransactionStatusOnDestinationChains";

async function getSecondHopStatus(
  messageId: string,
  ctx: any
): Promise<GMPTxStatus> {
  const secondHopData = await ctx.services.gmp.searchGMP({
    txHash: messageId,
    _source: SEARCHGMP_SOURCE,
  });

  return secondHopData.length > 0 ? secondHopData[0].status : "pending";
}

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
    status = await getSecondHopStatus(callback.returnValues.messageId, ctx);
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
 * Get the statuses of one or more GMP transactions on destination chains
 */
export const getTransactionStatusesOnDestinationChains = publicProcedure
  .input(
    z.object({
      txHashes: z.array(hex64Literal()),
    })
  )
  .query(async ({ ctx, input }) => {
    try {
      // Fetch all first hop transactions in parallel
      const gmpDataArrays = await Promise.all(
        input.txHashes.map((txHash) =>
          ctx.services.gmp.searchGMP({
            txHash,
            _source: SEARCHGMP_SOURCE,
          })
        )
      );

      // Process all GMP data entries in parallel
      const processedEntries = await Promise.all(
        gmpDataArrays.flat().map((gmpData) => processGMPData(gmpData, ctx))
      );

      // Convert the processed entries into a ChainStatusMap
      const result = Object.fromEntries(processedEntries);
      return result;
    } catch (error) {
      if (error instanceof TRPCError) throw error;

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to get the current status of the transactions",
      });
    }
  });
