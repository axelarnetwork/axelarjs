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
      // Fetch all first hop transactions
      const results = await Promise.all(
        input.txHashes.map((txHash) =>
          ctx.services.gmp.searchGMP({
            txHash,
            _source: SEARCHGMP_SOURCE,
          })
        )
      );

      // Process all transactions and their second hops
      const processedResults = await Promise.all(
        results.flat().map(async (gmpData) => {
          const {
            call,
            status: firstHopStatus,
            interchain_token_deployment_started: tokenDeployment,
            interchain_transfer: tokenTransfer,
          } = gmpData;

          const chainType = gmpData.call.chain_type;
          let secondHopStatus = "pending" as GMPTxStatus;

          // Check for second hop if callback exists
          if (gmpData.callback) {
            const secondHopMessageId = gmpData.callback.returnValues.messageId;
            const secondHopData = await ctx.services.gmp.searchGMP({
              txHash: secondHopMessageId,
              _source: SEARCHGMP_SOURCE,
            });

            if (secondHopData.length > 0) {
              secondHopStatus = secondHopData[0].status;
            }
          }

          const destinationChain =
            tokenTransfer?.destinationChain?.toLowerCase() ||
            tokenDeployment?.destinationChain?.toLowerCase() ||
            call.returnValues.destinationChain.toLowerCase();

          return {
            destinationChain,
            data: {
              status: chainType === "evm" ? firstHopStatus : secondHopStatus,
              txHash: call.transactionHash,
              logIndex: call.logIndex ?? call._logIndex ?? 0,
              txId: gmpData.message_id,
            },
          };
        })
      );

      // Combine all results into a single object
      return processedResults.reduce(
        (acc, { destinationChain, data }) => ({
          ...acc,
          [destinationChain]: data,
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
