import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { EVM_CHAIN_CONFIGS } from "~/config/wagmi";
import { publicProcedure } from "~/server/trpc";
import { ERC20Client } from "~/services/contracts/ERC20";

export const getERC20TokenDetails = publicProcedure
  .input(
    z.object({
      chainId: z.number(),
      tokenAddress: z.string().regex(/^(0x)?[0-9a-f]{40}$/i),
    })
  )
  .query(async ({ input }) => {
    try {
      const chainConfig = EVM_CHAIN_CONFIGS.find(
        (chain) => chain.id === input.chainId
      );

      if (!chainConfig) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid chainId",
        });
      }

      const client = new ERC20Client(chainConfig);

      const [tokenName, tokenSymbol, decimals] = await Promise.all([
        client.readContract({
          method: "name",
          address: input.tokenAddress as `0x${string}`,
        }),
        client.readContract({
          method: "symbol",
          address: input.tokenAddress as `0x${string}`,
        }),
        client.readContract({
          method: "decimals",
          address: input.tokenAddress as `0x${string}`,
        }),
      ]);

      return {
        tokenName: String(tokenName),
        tokenSymbol: String(tokenSymbol),
        decimals: Number(decimals),
      };
    } catch (error) {
      // If we get a TRPC error, we throw it
      if (error instanceof TRPCError) {
        throw error;
      }
      // otherwise, we throw an internal server error
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Failed to get ERC20 token details for ${input.tokenAddress} on ${input.chainId}`,
      });
    }
  });
