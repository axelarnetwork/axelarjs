import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { CHAIN_CONFIGS } from "~/config/wagmi";
import { publicProcedure, router } from "~/server/trpc";
import { ERC20Client } from "~/services/contracts/ERC20";
import { InterchainTokenLinkerClient } from "~/services/contracts/InterchainTokenLinker";

export const gmpRouter = router({
  /**
   * Get the status of a transaction
   */
  getTransactionStatus: publicProcedure
    // a procedure must have a schema for input validation, we use zod for this: https://zod.dev/
    .input(
      z.object({
        txHash: z.string().regex(/^(0x)?[0-9a-f]{64}$/i),
      })
    )
    // a procedure can either be a query or a mutation
    // a query is a read-only operation, a mutation is a write operation
    .query(async ({ input, ctx }) => {
      try {
        const gmpResponse = await ctx.services.gmp.searchGMP({
          txHash: input.txHash as `0x${string}`,
        });

        if (gmpResponse.data.length) {
          return gmpResponse.data[0].status;
        }

        // If we don't find the transaction, we throw a 404 error
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Transaction not found",
        });
      } catch (error) {
        // If we get a TRPC error, we throw it
        if (error instanceof TRPCError) {
          throw error;
        }
        // otherwise, we throw an internal server error
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to get transaction status",
        });
      }
    }),
  searchInterchainToken: publicProcedure
    .input(
      z.object({
        chainId: z.number(),
        tokenAddress: z.string().regex(/^(0x)?[0-9a-f]{40}$/i),
        chainIds: z.array(z.number().or(z.string())),
      })
    )
    .query(async ({ input }) => {
      try {
        const chainConfig = CHAIN_CONFIGS.find(
          (chain) => chain.id === input.chainId
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
          CHAIN_CONFIGS.filter(
            (chain) =>
              chain.id !== chainConfig.id && input.chainIds.includes(chain.id)
          ).map(async (chain) => {
            const client = new InterchainTokenLinkerClient(chain);

            try {
              const [matchingAddress, matchingTokenId, originTokenId] =
                await Promise.all([
                  client.readContract({
                    method: "getTokenAddress",
                    args: [tokenId],
                  }),
                  client.readContract({
                    method: "getTokenAddress",
                    args: [tokenId],
                  }),
                  client.readContract({
                    method: "getTokenId",
                    args: [tokenAddress as `0x${string}`],
                  }),
                  client.readContract({
                    method: "getOriginTokenId",
                    args: [tokenAddress as `0x${string}`],
                  }),
                ]);

              return {
                chainId: chain.id,
                chainName: chain.name,
                tokenAddress: matchingAddress,
                tokenId,
                originTokenId,
                isOriginToken: originTokenId === matchingTokenId,
                isRegistered: parseInt(tokenId, 16) > 0,
              };
            } catch (error) {
              console.log("error while scanning tokens", { error });
              return {
                originTokenId,
                chainId: chain.id,
                tokenAddress,
                isRegistered: parseInt(tokenAddress, 16) > 0,
              };
            }
          })
        );

        return {
          isOriginToken: originTokenId === tokenId,
          tokenId,
          tokenAddress,
          matchingTokens,
        };
      } catch (error) {
        // If we get a TRPC error, we throw it
        if (error instanceof TRPCError) {
          throw error;
        }
        // otherwise, we throw an internal server error
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to get transaction status",
        });
      }
    }),
  getERC20TokenDetails: publicProcedure
    .input(
      z.object({
        chainId: z.number(),
        tokenAddress: z.string().regex(/^(0x)?[0-9a-f]{40}$/i),
      })
    )
    .query(async ({ input }) => {
      try {
        const chainConfig = CHAIN_CONFIGS.find(
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
          tokenName,
          tokenSymbol,
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
          message: `Failed to get ERC20 token details for ${input.tokenAddress} on ${input.chainId}`,
        });
      }
    }),
});

// export type definition of API
export type GMPRouter = typeof gmpRouter;
