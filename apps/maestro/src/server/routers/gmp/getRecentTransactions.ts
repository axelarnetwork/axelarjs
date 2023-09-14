import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { NEXT_PUBLIC_INTERCHAIN_TOKEN_SERVICE_ADDRESS } from "~/config/env";
import { hex40Literal } from "~/lib/utils/validation";
import { publicProcedure } from "~/server/trpc";

/**
 * Get the most recent transactions for the current user
 */
export const getRecentTransactions = publicProcedure
  .input(
    z.object({
      size: z.number().optional().default(10),
      senderAddress: hex40Literal().optional(),
      contractMethod: z.union([
        z.literal("callContract"),
        z.literal("callContractWithToken"),
        z.literal("sendToken"),
        z.literal("StandardizedTokenDeployed"),
        z.literal("RemoteStandardizedTokenAndManagerDeploymentInitialized"),
      ]),
    })
  )
  .output(
    z.array(
      z.object({
        hash: z.string(),
        blockHash: z.string(),
        status: z.string(),
        timestamp: z.number(),
      })
    )
  )
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

      return response.map(({ call, status }) => ({
        status,
        hash: call.transactionHash,
        blockHash: call.blockHash,
        timestamp: call.block_timestamp,
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
