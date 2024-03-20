import type { IERC20BurnableMintableClient } from "@axelarjs/evm";
import { invariant } from "@axelarjs/utils";

import { TRPCError } from "@trpc/server";
import { always } from "rambda";
import { z } from "zod";

import { ExtendedWagmiChainConfig } from "~/config/evm-chains";
import { hex40Literal } from "~/lib/utils/validation";
import { publicProcedure } from "~/server/trpc";

//TODO: migrate to kv store?
const overrides: Record<`0x${string}`, Record<string, string>> = {
  "0x4200000000000000000000000000000000000042": {
    symbol: "axlOP",
  },
};

export const getERC20TokenDetails = publicProcedure
  .input(
    z.object({
      chainId: z.number().optional(),
      tokenAddress: hex40Literal(),
    }),
  )
  .query(async ({ input, ctx }) => {
    try {
      const { wagmiChainConfigs: chainConfigs } = ctx.configs;

      const chainConfig = chainConfigs.find(
        (chain) => chain.id === input.chainId,
      );

      if (!chainConfig) {
        for (const config of chainConfigs) {
          const client = ctx.contracts.createERC20Client(
            config,
            input.tokenAddress,
          );

          try {
            const details = await getTokenPublicDetails(
              client,
              config,
              input.tokenAddress,
            );

            if (details) {
              return details;
            }
          } catch (error) {
            console.log(
              `Token ${input.tokenAddress} not found on ${config.name}`,
            );
          }
        }

        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Invalid chainId: ${input.chainId}`,
        });
      }

      const client = ctx.contracts.createERC20Client(
        chainConfig,
        input.tokenAddress,
      );

      return getTokenPublicDetails(client, chainConfig, input.tokenAddress);
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

async function getTokenPublicDetails(
  client: IERC20BurnableMintableClient,
  chainConfig: ExtendedWagmiChainConfig,
  tokenAddress: `0x${string}`,
) {
  invariant(client.chain, "client.chain must be defined");

  const [name, symbol, decimals, owner, pendingOwner] = await Promise.all([
    client.reads.name(),
    client.reads.symbol(),
    client.reads.decimals(),
    client.reads.owner().catch(always(null)),
    client.reads.pendingOwner().catch(always(null)),
  ]);

  const override = overrides[tokenAddress];

  return {
    name,
    decimals,
    owner,
    pendingOwner,
    chainId: client.chain.id,
    chainName: client.chain.name,
    axelarChainId: chainConfig.axelarChainId,
    axelarChainName: chainConfig.axelarChainName,
    symbol: override?.symbol ?? symbol,
  };
}
