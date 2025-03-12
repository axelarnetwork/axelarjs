import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { publicProcedure } from "~/server/trpc";
import {
  processGMPData,
  SEARCHGMP_SOURCE,
} from "./getTransactionStatusOnDestinationChains";

/**
 * Get the statuses of one or more GMP transactions on destination chains
 */
export const getTransactionStatusesOnDestinationChains = publicProcedure
  .input(
    z.object({
      txHashes: z.array(z.string()),
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
