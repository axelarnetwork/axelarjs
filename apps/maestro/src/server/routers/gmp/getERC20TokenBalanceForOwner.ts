import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { EVM_CHAIN_CONFIGS } from "~/config/wagmi";
import { publicProcedure } from "~/server/trpc";
import { ERC20Client } from "~/services/contracts/ERC20";

export const getERC20TokenBalanceForOwner = publicProcedure
  .input(
    z.object({
      chainId: z.number(),
      tokenAddress: z.string().regex(/^(0x)?[0-9a-f]{40}$/i),
      owner: z.string().regex(/^(0x)?[0-9a-f]{40}$/i),
    })
  )
  .query(async ({ input }) => {
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
      const erc20Client = new ERC20Client(chainConfig);

      const [tokenBalance, decimals] = await Promise.all([
        erc20Client.readContractTokenBalance({
          method: "balanceOf",
          address: input.tokenAddress as `0x$${string}`,
          args: [input.owner as `0x$${string}`],
        }),
        erc20Client.readContract({
          method: "decimals",
          address: input.tokenAddress as `0x${string}`,
        }),
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
