import { z } from "zod";

import { protectedProcedure } from "~/server/trpc";

/**
 * Updates the remote token address for EVM chains (like Hedera) by querying the
 * InterchainTokenService contract's registeredTokenAddress function.
 *
 * This is particularly useful when the token address is not known at deployment time,
 * which can happen with registered tokens where the actual deployed address is
 * determined by the InterchainTokenService contract after the deployment transaction
 * is executed.
 *
 * @param input.tokenId - The token ID to look up
 * @param input.axelarChainId - The Axelar chain ID to query
 * @returns Promise that resolves when the database is updated with the correct token address
 */
export const updateEVMRemoteTokenAddress = protectedProcedure
  .input(
    z.object({
      tokenId: z.string(),
      axelarChainId: z.string(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const chains = await ctx.configs.evmChains();

    const chainConfig = chains[input.axelarChainId];

    const itsClient = ctx.contracts.createInterchainTokenServiceClient(
      chainConfig.wagmi
    );

    const tokenAddress = await itsClient.reads.registeredTokenAddress({
      tokenId: input.tokenId as `0x${string}`,
    });

    return ctx.persistence.postgres.updateEVMRemoteTokenAddress(
      input.tokenId,
      tokenAddress
    );
  });
