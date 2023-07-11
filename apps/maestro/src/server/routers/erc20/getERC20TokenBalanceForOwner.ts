import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { EVM_CHAIN_CONFIGS } from "~/config/wagmi";
import { hex64Literal } from "~/lib/utils/schemas";
import { publicProcedure } from "~/server/trpc";

export const getERC20TokenBalanceForOwner = publicProcedure
  .input(
    z.object({
      chainId: z.number(),
      tokenAddress: hex64Literal(),
      owner: hex64Literal(),
    })
  )
  .query(async ({ input, ctx }) => {
    const chainConfig = EVM_CHAIN_CONFIGS.find(
      (chain) => chain.id === input.chainId
    );

    if (!chainConfig) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Invalid chainId",
      });
    }

    try {
      const client = ctx.contracts.createERC20Client(
        chainConfig,
        input.tokenAddress
      );

      const [tokenBalance, decimals] = await Promise.all([
        client.read("balanceOf", {
          args: [input.owner],
        }),
        client.read("decimals"),
      ]);

      return {
        tokenBalance: tokenBalance.toString(),
        decimals,
      };
    } catch (error) {
      // If we get a TRPC error, we throw it
      if (error instanceof TRPCError) {
        throw error;
      }
      // otherwise, we throw an internal server error
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Failed to get ERC20 token balance on ${input.tokenAddress} on chain ${input.chainId} for ${input.owner}`,
        cause: error,
      });
    }
  });
