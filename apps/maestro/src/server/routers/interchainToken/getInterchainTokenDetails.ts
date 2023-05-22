import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { EVM_CHAIN_CONFIGS } from "~/config/wagmi";
import { publicProcedure } from "~/server/trpc";

export const getInterchainTokenDetails = publicProcedure
  .input(
    z.object({
      chainId: z.number(),
      tokenAddress: z.string().regex(/^(0x)?[0-9a-f]{40}$/i),
    })
  )
  .query(async ({ input, ctx }) => {
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

      const client = ctx.contracts.createInterchainTokenClient(
        chainConfig,
        input.tokenAddress as `0x${string}`
      );

      const [tokenName, tokenSymbol, decimals, owner] = await Promise.all([
        client.readContract("name"),
        client.readContract("symbol"),
        client.readContract("decimals"),
        client.readContract("owner"),
      ]);

      return {
        name: String(tokenName),
        symbol: String(tokenSymbol),
        decimals: Number(decimals),
        owner: String(owner) as `0x${string}`,
      };
    } catch (error) {
      // If we get a TRPC error, we throw it
      if (error instanceof TRPCError) {
        throw error;
      }
      // otherwise, we throw an internal server error
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Failed to get Interchaintoken details for ${input.tokenAddress} on ${input.chainId}`,
      });
    }
  });
