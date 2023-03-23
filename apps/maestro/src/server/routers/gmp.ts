import { TRPCError } from "@trpc/server";
import { createPublicClient, http } from "viem";
import { z } from "zod";

import { CHAIN_CONFIGS } from "~/config/wagmi";
import { InterchainTokenLinker } from "~/lib/contract/abis";
import { publicProcedure, router } from "~/server/trpc";

type ContractReadAction =
  | {
      method: "getTokenId" | "getOriginTokenId";
      args: [address: `0x${string}`];
    }
  | {
      method: "getTokenAddress";
      args: [tokenId: `0x${string}`];
    };

class InterchainTokenLinkerClient {
  private client: ReturnType<typeof createPublicClient>;

  constructor(chainConfig: (typeof CHAIN_CONFIGS)[number]) {
    this.client = createPublicClient({
      chain: chainConfig,
      transport: http(),
    });
  }

  async readContract(action: ContractReadAction) {
    const result = await this.client.readContract({
      address: String(
        process.env.NEXT_PUBLIC_TOKEN_LINKER_ADDRESS
      ) as `0x${string}`,
      abi: InterchainTokenLinker.abi,
      functionName: action.method,
      args: action.args,
    });

    return result;
  }
}

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
      })
    )
    .query(async ({ input, ctx }) => {
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
          CHAIN_CONFIGS.filter((chain) => chain.id !== chainConfig.id).map(
            async (chain) => {
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
                };
              } catch (error) {
                return {
                  chainId: chain.id,
                  tokenAddress,
                  tokenId,
                };
              }
            }
          )
        );

        const filtered = matchingTokens.filter(
          (x) => parseInt(x.tokenAddress, 16) > 0
        );

        return {
          isOriginToken: originTokenId === tokenId,
          tokenId,
          tokenAddress,
          matchingTokens: filtered,
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
});

// export type definition of API
export type GMPRouter = typeof gmpRouter;
