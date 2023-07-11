import { TRPCError } from "@trpc/server";
import { always } from "rambda";
import { zeroAddress } from "viem";
import { z } from "zod";

import { EVM_CHAIN_CONFIGS } from "~/config/wagmi";
import { hex40Literal } from "~/lib/utils/schemas";
import { publicProcedure } from "~/server/trpc";

export const getInterchainTokenBalanceForOwner = publicProcedure
  .input(
    z.object({
      chainId: z.number(),
      tokenAddress: hex40Literal(),
      owner: hex40Literal(),
    })
  )
  .query(async ({ input, ctx }) => {
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
      const erc20 = ctx.contracts.createERC20Client(
        chainConfig,
        input.tokenAddress
      );

      const [tokenBalance, decimals, owner, pendingOwner] = await Promise.all([
        erc20
          .read("balanceOf", { args: [input.owner] })
          .catch(always(BigInt(0))),
        erc20.read("decimals").catch(always(null)),
        erc20.read("owner").catch(always(null)),
        erc20.read("pendingOwner").catch(always(null)),
      ]);

      return {
        decimals,
        tokenBalance: tokenBalance.toString(),
        isTokenOwner: input.owner === owner,
        isTokenPendingOwner: input.owner === pendingOwner,
        hasPendingOwner: Boolean(pendingOwner) && pendingOwner !== zeroAddress,
      };
    } catch (error) {
      // If we get a TRPC error, we throw it
      if (error instanceof TRPCError) {
        throw error;
      }
      // otherwise, we throw an internal server error
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Failed to get Interchaintoken balance on ${input.tokenAddress} on chain ${input.chainId} for ${input.owner}`,
        cause: error,
      });
    }
  });
