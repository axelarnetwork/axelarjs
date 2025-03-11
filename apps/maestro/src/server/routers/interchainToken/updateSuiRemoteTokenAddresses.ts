import { z } from "zod";

import { protectedProcedure } from "~/server/trpc";
import { getCoinAddressAndManagerByTokenId } from "../sui/utils/utils";

export const updateSuiRemoteTokenAddresses = protectedProcedure
  .input(
    z.object({
      tokenId: z.string(),
      suiChainId: z.string(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const { suiChainId, tokenId } = input;
    const chainConfigs = await ctx.configs.axelarConfigs();
    const chainConfig = chainConfigs.chains[suiChainId];
    const response = await getCoinAddressAndManagerByTokenId({
        tokenId,
        suiChainConfig: chainConfig,
      });

    if (!response) {
      throw new Error("Failed to retrieve token details");
    }

    const { tokenAddress, tokenManager } = response;

    return ctx.persistence.postgres.updateSuiRemoteTokenAddresses({
      tokenId,
      tokenAddress,
      tokenManager,
    });
  });
