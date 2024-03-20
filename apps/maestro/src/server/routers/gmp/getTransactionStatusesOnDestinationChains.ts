import type { GMPTxStatus } from "@axelarjs/api";

import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { hex64Literal } from "~/lib/utils/validation";
import { publicProcedure } from "~/server/trpc";
import { SEARCHGMP_SOURCE } from "./getTransactionStatusOnDestinationChains";

const INPUT_SCHEMA = z.object({
  txHashes: z.array(hex64Literal()),
});

/**
 * Get the statuses of one or more GMP transactions on destination chains
 */
export const getTransactionStatusesOnDestinationChains = publicProcedure
  .input(INPUT_SCHEMA)
  .query(async ({ ctx, input }) => {
    try {
      const results = await Promise.all(
        input.txHashes.map((txHash) =>
          ctx.services.gmp.searchGMP({
            txHash,
            _source: SEARCHGMP_SOURCE,
          })
        )
      );

      return results.flat().reduce(
        (acc, { call, status }) => ({
          ...acc,
          [call.returnValues.destinationChain.toLowerCase()]: {
            status,
            txHash: call.transactionHash,
            logIndex: call.logIndex ?? call._logIndex ?? 0,
            txId: call.id,
          },
        }),
        {} as {
          [chainId: string]: {
            status: GMPTxStatus;
            txHash: `0x${string}`;
            logIndex: number;
            txId?: string;
          };
        }
      );
    } catch (error) {
      // If we get a TRPC error, we throw it
      if (error instanceof TRPCError) {
        throw error;
      }
      // otherwise, we throw an internal server error
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to get the current status of the transactions",
      });
    }
  });
