import type { ContractMethod, SearchGMPResponseData } from "@axelarjs/api";

import { TRPCError } from "@trpc/server";
import { uniqBy } from "rambda";
import { z } from "zod";

import { publicProcedure } from "~/server/trpc";

const INPUT_SCHEMA = z.object({
  pageSize: z.number().optional().default(20),
  page: z.number().optional().default(0),
  senderAddress: z.string().optional(),
  contractMethod: z.union([
    z.literal("InterchainTransfer"),
    z.literal("InterchainTokenDeploymentStarted"),
  ]),
});

export type RecentTransactionsInput = z.infer<typeof INPUT_SCHEMA>;

export type RecentTransactionsOutput = {
  hash: string;
  blockHash: string;
  status: string;
  timestamp: number;
  event?:
    | NonNullable<SearchGMPResponseData["interchain_transfer"]>
    | NonNullable<SearchGMPResponseData["interchain_token_deployment_started"]>;
}[];

/**
 * Get the most recent transactions for the current user
 */
export const getRecentTransactions = publicProcedure
  .input(INPUT_SCHEMA)
  .query(async ({ input, ctx }) => {
    try {
      const response = await ctx.services.gmp.searchGMP({
        senderAddress: input.senderAddress,
        size: input.pageSize,
        from: input.page * input.pageSize,
        contractMethod: input.contractMethod,
        _source: {
          includes: [
            "call.transactionHash",
            "call.blockHash",
            "call.block_timestamp",
            "interchain_transfer",
            "interchain_token_deployment_started",
          ],
        },
      });

      const deduped = uniqBy((tx) => tx.call.transactionHash, response);

      return deduped.map(({ call, status, ...tx }) => {
        const event = extractEvent(tx, input.contractMethod);

        // Ensure tokenId starts with 0x if present, this is a workaround for the api
        if (event?.tokenId && !event.tokenId.startsWith("0x")) {
          event.tokenId = `0x${event.tokenId}`;
        }

        return {
          status,
          hash: call.transactionHash,
          blockHash: call.blockHash,
          timestamp: call.block_timestamp,
          event: extractEvent(tx, input.contractMethod),
        };
      }) as RecentTransactionsOutput;
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error;
      }

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to get recent transactions",
      });
    }
  });

function extractEvent(
  response: Partial<SearchGMPResponseData>,
  contractMethod: ContractMethod
) {
  switch (contractMethod) {
    case "InterchainTransfer":
      return response.interchain_transfer;
    case "InterchainTokenDeploymentStarted":
      return response.interchain_token_deployment_started;
    default:
      return undefined;
  }
}
