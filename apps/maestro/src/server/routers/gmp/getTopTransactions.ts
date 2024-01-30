import { TRPCError } from "@trpc/server";
import { groupBy } from "rambda";
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

/**
 * Get the top transactions by token address
 */
export const getTopTransactions = publicProcedure
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

      const grouped = groupBy(
        (tx) => tx.interchain_transfer?.tokenId ?? "",
        response
      );

      const filtered = Object.entries(grouped).filter(([tokenId]) =>
        Boolean(tokenId)
      );

      return filtered
        .map(([tokenId, txs]) => ({
          tokenId: tokenId as `0x${string}`,
          name: txs[0].interchain_transfer?.name ?? "",
          symbol: txs[0].interchain_transfer?.symbol ?? "",
          address:
            txs[0].interchain_transfer?.contract_address ??
            ("" as `0x${string}`),
          count: txs.length,
        }))
        .sort((a, b) => b.count - a.count);
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

// infer the output type from the procedure
export type GetTopTransactionsOutput =
  typeof getTopTransactions._def._output_out;
