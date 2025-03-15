import { z } from "zod";

import { protectedProcedure } from "~/server/trpc";
import { getStellarTokenRegistrationDetails } from "./searchInterchainToken";

export const updateStellarRemoteTokenAddresses = protectedProcedure
  .input(
    z.object({
      tokenId: z.string(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const { tokenId } = input;

    // Get the token registration details by querying the Stellar contract
    const response = await getStellarTokenRegistrationDetails(tokenId);

    if (!response.isRegistered) {
      throw new Error("Failed to retrieve Stellar token details");
    }

    // Extract token and token manager addresses
    const { tokenAddress, tokenManagerAddress } = response;

    // Update the addresses in the database
    return ctx.persistence.postgres.updateStellarRemoteTokenAddresses({
      tokenId,
      tokenAddress: tokenAddress!,
      tokenManagerAddress: tokenManagerAddress!,
    });
  });
