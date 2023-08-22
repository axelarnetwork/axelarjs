import { TRPCError } from "@trpc/server";
import { always } from "rambda";
import { z } from "zod";

import { EVM_CHAIN_CONFIGS } from "~/config/wagmi";
import { hex40Literal } from "~/lib/utils/validation";
import { publicProcedure } from "~/server/trpc";

export const getERC20TokenBalanceForOwner = publicProcedure
  .input(
    z.object({
      chainId: z.number(),
      tokenAddress: hex40Literal(),
      owner: hex40Literal(),
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

      const [tokenBalance, decimals, owner, pendingOwner] = await Promise.all([
        client.read("balanceOf", {
          args: [input.owner],
        }),
        client.read("decimals"),
        client.read("owner").catch(always(null)),
        client.read("pendingOwner").catch(always(null)),
      ]);

      return {
        tokenBalance: tokenBalance.toString(),
        decimals,
        isTokenOwner: owner === input.owner,
        isTokenPendingOwner: pendingOwner === input.owner,
        hasPendingOwner: pendingOwner !== null,
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
