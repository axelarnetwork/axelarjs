import type { InterchainTokenServiceClient } from "@axelarjs/evm";

import { TRPCError } from "@trpc/server";
import { always, partition } from "rambda";
import { z } from "zod";

import { EVM_CHAIN_CONFIGS, type WagmiEVMChainConfig } from "~/config/wagmi";
import { hex40, hex64 } from "~/lib/utils/schemas";
import type { Context } from "~/server/context";
import { publicProcedure } from "~/server/trpc";

const tokenDetails = () => ({
  tokenId: hex40().nullable(),
  tokenAddress: hex64().nullable(),
  isOriginToken: z.boolean(),
  isRegistered: z.boolean(),
  chainId: z.number(),
});

export type IntercahinTokenInfo = {
  tokenId: `0x${string}` | null;
  tokenAddress: `0x${string}` | null;
  isOriginToken: boolean;
  isRegistered: boolean;
  chainId: number;
};

export type SearchInterchainTokenOutput = IntercahinTokenInfo & {
  matchingTokens: IntercahinTokenInfo[];
};

export const searchInterchainToken = publicProcedure
  .meta({
    openapi: {
      summary: "Search for an interchain token",
      description:
        "Search for an interchain token by address, either on a specific chain or on any chain",
      method: "GET",
      path: "/interchain-token/search",
      tags: ["interchain-token"],
    },
  })
  .input(
    z.object({
      chainId: z.number().optional(),
      tokenAddress: hex64(),
    })
  )
  .output(
    z
      .object({
        ...tokenDetails(),
        matchingTokens: z.array(z.object(tokenDetails())),
      })
      .nullable()
  )
  .query(async ({ input, ctx }) => {
    try {
      const [[chainConfig], remainingChainConfigs] = partition(
        (chain) => chain.id === input.chainId,
        EVM_CHAIN_CONFIGS
      );

      if (!chainConfig) {
        for (const chainConfig of EVM_CHAIN_CONFIGS) {
          const itsClient =
            ctx.contracts.createInterchainTokenServiceClient(chainConfig);

          try {
            const tokenId = await itsClient
              .readContract("getCanonicalTokenId", {
                args: [input.tokenAddress as `0x${string}`],
              })
              .catch(always(null));

            if (tokenId) {
              const result = await getInterchainTokenDetails(
                tokenId,
                itsClient,
                chainConfig,
                remainingChainConfigs,
                {
                  tokenAddress: input.tokenAddress,
                  chainId: chainConfig.id,
                },
                ctx
              );

              // cache for 1 hour
              ctx.res.setHeader("Cache-Control", "public, max-age=3600");

              return result;
            }
          } catch (error) {
            console.log(
              `Token ${input.tokenAddress} not registered on ${chainConfig.name}`
            );
          }
        }

        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Token ${input.tokenAddress} not registered on any chain`,
        });
      }

      const client =
        ctx.contracts.createInterchainTokenServiceClient(chainConfig);

      const canonicalTokenId = await client.readContract(
        "getCanonicalTokenId",
        {
          args: [input.tokenAddress as `0x${string}`],
        }
      );

      const result = await getInterchainTokenDetails(
        canonicalTokenId,
        client,
        chainConfig,
        remainingChainConfigs,
        input,
        ctx
      );

      // cache for 1 hour
      ctx.res.setHeader("Cache-Control", "public, max-age=3600");

      return result;
    } catch (error) {
      // If we get a TRPC error, we throw it
      if (error instanceof TRPCError) {
        throw error;
      }
      // otherwise, we throw an internal server error
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to get InterchainToken details",
        cause: error,
      });
    }
  });

async function getInterchainTokenDetails(
  tokenId: `0x${string}`,
  itsClient: InterchainTokenServiceClient,
  chainConfig: WagmiEVMChainConfig,
  remainingChainConfigs: WagmiEVMChainConfig[],
  input: {
    tokenAddress: string;
    chainId?: number;
  },
  ctx: Context
) {
  const matchingTokens = await Promise.all(
    remainingChainConfigs.map(async (chain) => {
      try {
        const itsClient =
          ctx.contracts.createInterchainTokenServiceClient(chain);

        const chainTokenId = await itsClient.readContract(
          "getCanonicalTokenId",
          {
            args: [input.tokenAddress as `0x${string}`],
          }
        );

        const isRegistered = chainTokenId !== null;

        const isOriginToken = tokenId === chainTokenId;

        return {
          tokenId: isOriginToken ? tokenId : chainTokenId,
          isOriginToken: tokenId === chainTokenId,
          chainId: chain.id,
          chainName: chain.name,
          tokenAddress: input.tokenAddress as `0x${string}`,
          isRegistered,
        };
      } catch (error) {
        return {
          tokenId: null,
          chainId: chain.id,
          tokenAddress: null,
          isOriginToken: false,
          isRegistered: false,
        };
      }
    })
  );

  const canonicalTokenId = await itsClient.readContract("getCanonicalTokenId", {
    args: [input.tokenAddress as `0x${string}`],
  });

  const lookupToken = {
    tokenId: canonicalTokenId,
    tokenAddress: input.tokenAddress as `0x${string}`,
    isOriginToken: canonicalTokenId === tokenId,
    isRegistered: true,
    chainId: chainConfig.id,
  };

  const output: SearchInterchainTokenOutput = {
    ...lookupToken,
    matchingTokens: [
      lookupToken,
      ...matchingTokens.filter((x) => x.tokenId !== lookupToken.tokenId),
    ].sort(
      // isOriginToken first, then isRegistered
      (a, b) => {
        if (a.isOriginToken && !b.isOriginToken) {
          return -1;
        }
        if (!a.isOriginToken && b.isOriginToken) {
          return 1;
        }

        if (a.isRegistered && !b.isRegistered) {
          return -1;
        }
        if (!a.isRegistered && b.isRegistered) {
          return 1;
        }

        return 0;
      }
    ),
  };

  return output;
}
