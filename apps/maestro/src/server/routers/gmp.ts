import { TRPCError } from "@trpc/server";
import { constants } from "ethers";
import { partition } from "rambda";
import { z } from "zod";

import { EVM_CHAIN_CONFIGS } from "~/config/wagmi";
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

        if (!tokenId) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: `Token not found on ${chainConfig.name} (${chainConfig.id}))`,
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

              const matchingTokenAddressFromTokenId = await client.readContract(
                {
                  method: "getTokenAddress",
                  args: [tokenId],
                }
              );

              const [matchingTokenId, matchingOriginTokenId] =
                await Promise.all([
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
  getERC20TokenBalanceForOwner: publicProcedure
    .input(
      z.object({
        chainId: z.number(),
        tokenLinkerTokenId: z.string().regex(/^(0x)?[0-9a-f]{64}$/i),
        owner: z.string().regex(/^(0x)?[0-9a-f]{40}$/i),
      })
    )
    .query(async ({ input }) => {
      let tokenAddress = "";

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
        tokenAddress = await new InterchainTokenLinkerClient(
          chainConfig
        ).readContract({
          method: "getTokenAddress",
          args: [input.tokenLinkerTokenId as `0x${string}`],
        });

        if (!tokenAddress) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Invalid tokenAddress",
          });
        }

        if (tokenAddress === constants.AddressZero) {
          return null;
        }
      } catch (error) {
        // If we get a TRPC error, we throw it
        if (error instanceof TRPCError) {
          throw error;
        }
        // otherwise, we throw an internal server error
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to get ERC20 token address on ${input.tokenLinkerTokenId} on chain ${input.chainId}`,
        });
      }

      try {
        const erc20Client = new ERC20Client(chainConfig);

        const [tokenBalance, decimals] = await Promise.all([
          erc20Client.readContractTokenBalance({
            method: "balanceOf",
            address: tokenAddress as `0x$${string}`,
            args: [input.owner as `0x$${string}`],
          }),
          erc20Client.readContract({
            method: "decimals",
            address: tokenAddress as `0x${string}`,
          }),
        ]);

        return { tokenBalance: String(tokenBalance), decimals };
      } catch (error) {
        // If we get a TRPC error, we throw it
        if (error instanceof TRPCError) {
          throw error;
        }
        // otherwise, we throw an internal server error
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to get ERC20 token balance on ${tokenAddress} on chain ${input.chainId} for ${input.owner}`,
        });
      }
    }),
});

// export type definition of API
export type GMPRouter = typeof gmpRouter;
