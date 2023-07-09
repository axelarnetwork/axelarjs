import { TRPCError } from "@trpc/server";
import { always } from "rambda";
import { zeroAddress } from "viem";
import { z } from "zod";

import { EVM_CHAIN_CONFIGS } from "~/config/wagmi";
import { hex64 } from "~/lib/utils/schemas";
import { publicProcedure } from "~/server/trpc";

export const getInterchainTokenBalanceForOwner = publicProcedure
  .input(
    z.object({
      chainId: z.number(),
      tokenAddress: hex64(),
      owner: hex64(),
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
        input.tokenAddress as `0x${string}`
      );

      const [tokenBalance, decimals, owner, pendingOwner] = await Promise.all([
        client.readContract("balanceOf", {
          args: [input.owner as `0x$${string}`],
        }),
        client.readContract("decimals").catch(always(null)),
        client.readContract("owner").catch(always(null)),
        client.readContract("pendingOwner").catch(always(null)),
      ]);

      return {
        decimals,
        tokenBalance: tokenBalance.toString(),
        isTokenOwner: input.owner === owner,
        isTokenPendingOwner: input.owner === pendingOwner,
        hasPendingOwner: Boolean(pendingOwner) && pendingOwner !== zeroAddress,
      };
    } catch (error) {
      // If we get a TRPC error, we throw it
      if (error instanceof TRPCError) {
        throw error;
      }
      // otherwise, we throw an internal server error
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Failed to get Interchaintoken balance on ${input.tokenAddress} on chain ${input.chainId} for ${input.owner}`,
        cause: error,
      });
    }
  });
