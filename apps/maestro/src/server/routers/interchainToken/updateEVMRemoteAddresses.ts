import { z } from "zod";

import { protectedProcedure } from "~/server/trpc";

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
