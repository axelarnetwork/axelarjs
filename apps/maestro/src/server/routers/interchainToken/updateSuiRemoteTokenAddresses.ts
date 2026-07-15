import { z } from "zod";

import { protectedProcedure } from "~/server/trpc";
import { getCoinAddressAndManagerByTokenId, getSuiChainConfig } from "../sui/utils/utils";
import { assertTokenOwnership } from "./assertTokenOwnership";

export const updateSuiRemoteTokenAddresses = protectedProcedure
  .input(
    z.object({
      tokenId: z.string()
    })
  )
  .mutation(async ({ ctx, input }) => {
    const { tokenId } = input;

    await assertTokenOwnership(ctx, tokenId);

    const chainConfig = await getSuiChainConfig(ctx);
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
