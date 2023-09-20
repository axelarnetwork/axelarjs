import { type ContractMethod, type SearchGMPResponseData } from "@axelarjs/api";

import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { NEXT_PUBLIC_INTERCHAIN_TOKEN_SERVICE_ADDRESS } from "~/config/env";
import { hex40Literal, hex64Literal } from "~/lib/utils/validation";
import { publicProcedure } from "~/server/trpc";

const INPUT_SCHEMA = z.object({
  size: z.number().optional().default(20),
  senderAddress: hex40Literal().optional(),
  contractMethod: z.union([
    z.literal("sendToken"),
    z.literal("StandardizedTokenDeployed"),
  ]),
});

export type RecentTransactionsInput = z.infer<typeof INPUT_SCHEMA>;

const OUTPUT_SCHEMA = z.array(
  z.object({
    hash: z.string(),
    blockHash: z.string(),
    status: z.string(),
    timestamp: z.number(),
    event: z
      .union([
        z.object({
          event: z.literal("TokenSent"),
          symbol: z.string(),
          amount: z.string(),
          destinationAddress: hex40Literal(),
          tokenId: hex64Literal(),
          decimals: z.number(),
          name: z.string(),
          destinationChain: z.string(),
          contract_address: hex40Literal(),
        }),
        z.object({
          event: z.literal("StandardizedTokenDeployed"),
          mintAmount: z.string(),
          symbol: z.string(),
          tokenId: hex64Literal(),
          mintTo: hex40Literal(),
          decimals: z.number(),
          name: z.string(),
        }),
      ])
      .optional(),
  })
);

export type RecentTransactionsOutput = z.infer<typeof OUTPUT_SCHEMA>;

/**
 * Get the most recent transactions for the current user
 */
export const getRecentTransactions = publicProcedure
  .input(INPUT_SCHEMA)
  .output(OUTPUT_SCHEMA)
  .meta({
    openapi: {
      summary: "Get the most recent transactions for the current user",
      method: "GET",
      path: "/gmp/recent-transactions",
      tags: ["gmp"],
    },
  })
  .query(async ({ input, ctx }) => {
    try {
      const response = await ctx.services.gmp.searchGMP({
        senderAddress: input.senderAddress,
        destinationContractAddress:
          NEXT_PUBLIC_INTERCHAIN_TOKEN_SERVICE_ADDRESS,
        size: input.size,
        contractMethod: input.contractMethod,
      });

      return response.map(({ call, status, ...tx }) => ({
        status,
        hash: call.transactionHash,
        blockHash: call.blockHash,
        timestamp: call.block_timestamp,
        event: extractEvent(tx, input.contractMethod),
      }));
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
    case "sendToken":
      return response.token_sent;
    case "StandardizedTokenDeployed":
      return response.token_deployed;
    default:
      return undefined;
  }
}
