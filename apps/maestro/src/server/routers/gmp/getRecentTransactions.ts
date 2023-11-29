import type { ContractMethod, SearchGMPResponseData } from "@axelarjs/api";

import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { NEXT_PUBLIC_INTERCHAIN_TOKEN_SERVICE_ADDRESS } from "~/config/env";
import { hex40Literal } from "~/lib/utils/validation";
import { publicProcedure } from "~/server/trpc";

const INPUT_SCHEMA = z.object({
  pageSize: z.number().optional().default(20),
  page: z.number().optional().default(0),
  senderAddress: hex40Literal().optional(),
  contractMethod: z.union([
    z.literal("InterchainTransfer"),
    z.literal("InterchainTokenDeploymentStarted"),
  ]),
});

export type RecentTransactionsInput = z.infer<typeof INPUT_SCHEMA>;

export type RecentTransactionsOutput = {
  hash: `0x${string}`;
  blockHash: `0x${string}`;
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
        destinationContractAddress:
          NEXT_PUBLIC_INTERCHAIN_TOKEN_SERVICE_ADDRESS,
        size: input.pageSize,
        from: input.page * input.pageSize,
        contractMethod: input.contractMethod,
      });

      return response.map(({ call, status, ...tx }) => ({
        status,
        hash: call.transactionHash,
        blockHash: call.blockHash,
        timestamp: call.block_timestamp,
        event: extractEvent(tx, input.contractMethod),
      })) as RecentTransactionsOutput;
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
