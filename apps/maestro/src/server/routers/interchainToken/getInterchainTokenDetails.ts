import type { InterchainTokenClient } from "@axelarjs/evm";

import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { EVM_CHAIN_CONFIGS } from "~/config/wagmi";
import { publicProcedure } from "~/server/trpc";

export const getInterchainTokenDetails = publicProcedure
  .input(
    z.object({
      chainId: z.number().optional(),
      tokenAddress: z.string().regex(/^(0x)?[0-9a-f]{40}$/i),
    })
  )
  .query(async ({ input, ctx }) => {
    try {
      const chainConfig = EVM_CHAIN_CONFIGS.find(
        (chain) => chain.id === input.chainId
      );

      if (!chainConfig) {
        // scan all chains
        for (const chainConfig of EVM_CHAIN_CONFIGS) {
          const client = ctx.contracts.createInterchainTokenClient(
            chainConfig,
            input.tokenAddress as `0x${string}`
          );

          try {
            const details = await getTokenDetails(client);

            if (details) {
              return details;
            }
            // continue scanning
          } catch (error) {
            console.log(
              `Token ${input.tokenAddress} not deployed on ${chainConfig.name}`
            );
          }
        }

        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid chainId",
        });
      }

      const client = ctx.contracts.createInterchainTokenClient(
        chainConfig,
        input.tokenAddress as `0x${string}`
      );

      return getTokenDetails(client);
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

async function getTokenDetails(client: InterchainTokenClient) {
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
    chainId: client.chain?.id,
    chainName: client.chain?.name,
  };
}
