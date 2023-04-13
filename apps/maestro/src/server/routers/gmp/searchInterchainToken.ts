import { TRPCError } from "@trpc/server";
import { partition } from "rambda";
import { z } from "zod";

import { EVM_CHAIN_CONFIGS } from "~/config/wagmi";
import { publicProcedure } from "~/server/trpc";
import { InterchainTokenLinkerClient } from "~/services/contracts/InterchainTokenLinker";

const isAddressZero = (address: string) => parseInt(address, 16) === 0;

export const searchInterchainToken = publicProcedure
  .input(
    z.object({
      chainId: z.number(),
      tokenAddress: z.string().regex(/^(0x)?[0-9a-f]{40}$/i),
      chainIds: z.array(z.number().or(z.string())),
    })
  )
  .query(async ({ input }) => {
    try {
      const [[chainConfig], remainingChainConfigs] = partition(
        (chain) => chain.id === input.chainId,
        EVM_CHAIN_CONFIGS
      );

      if (!chainConfig) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid chainId",
        });
      }

      const client = new InterchainTokenLinkerClient(chainConfig);

      const [tokenId, originTokenId] = await Promise.all([
        client.readContract({
          method: "getTokenId",
          args: [input.tokenAddress as `0x${string}`],
        }),
        client.readContract({
          method: "getOriginTokenId",
          args: [input.tokenAddress as `0x${string}`],
        }),
      ]);

      if (!tokenId || isAddressZero(tokenId)) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Token not found on ${chainConfig.name} (${chainConfig.id})`,
        });
      }

      const tokenAddress = await client.readContract({
        method: "getTokenAddress",
        args: [tokenId],
      });

      if (tokenAddress.toLowerCase() !== input.tokenAddress.toLowerCase()) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Token ids don't match. ${{
            tokenId,
            tokenAddress,
          }} `,
        });
      }

      const matchingTokens = await Promise.all(
        remainingChainConfigs.map(async (chain) => {
          try {
            const client = new InterchainTokenLinkerClient(chain);

            const matchingTokenAddressFromTokenId = await client.readContract({
              method: "getTokenAddress",
              args: [tokenId],
            });

            const [matchingTokenId, matchingOriginTokenId] = await Promise.all([
              client.readContract({
                method: "getTokenId",
                args: [matchingTokenAddressFromTokenId as `0x${string}`],
              }),
              client.readContract({
                method: "getOriginTokenId",
                args: [matchingTokenAddressFromTokenId as `0x${string}`],
              }),
            ]);

            return {
              tokenId,
              chainId: chain.id,
              chainName: chain.name,
              tokenAddress: matchingTokenAddressFromTokenId,
              originTokenId: matchingOriginTokenId,
              isOriginToken: matchingOriginTokenId === matchingTokenId,
              isRegistered: parseInt(matchingTokenAddressFromTokenId, 16) > 0,
            };
          } catch (error) {
            return {
              tokenId,
              originTokenId,
              chainId: chain.id,
              tokenAddress,
              isOriginToken: false,
              isRegistered: false,
            };
          }
        })
      );

      const lookupToken = {
        tokenId,
        chainId: input.chainId,
        originTokenId,
        tokenAddress,
        isOriginToken: originTokenId === tokenId,
        isRegistered: parseInt(tokenAddress, 16) > 0,
      };

      return {
        ...lookupToken,
        matchingTokens: [lookupToken, ...matchingTokens],
      };
    } catch (error) {
      // If we get a TRPC error, we throw it
      if (error instanceof TRPCError) {
        throw error;
      }
      // otherwise, we throw an internal server error
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to get InterchainTokenLinker details",
        cause: error,
      });
    }
  });
