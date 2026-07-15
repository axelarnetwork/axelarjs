import { TRPCError } from "@trpc/server";

import type { Context } from "~/server/context";

/**
 * Object-level authorization guard for per-token write procedures.
 *
 * `protectedProcedure` only ensures a session exists; it does NOT check that
 * the caller owns the token they are mutating. This asserts that the current
 * session belongs to the token's deployer, so a session cannot overwrite the
 * metadata of tokens it does not own.
 *
 * Comparison is case-insensitive to tolerate checksummed vs. lower-cased
 * addresses; both sides are lower-cased, so equality still holds for the
 * case-sensitive (Stellar/Sui) encodings we store.
 */
export async function assertTokenOwnership(ctx: Context, tokenId: string) {
  const token =
    await ctx.persistence.postgres.getInterchainTokenByTokenId(tokenId);

  if (!token) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: `No interchain token found for tokenId ${tokenId}`,
    });
  }

  if (
    token.deployerAddress?.toLowerCase() !==
    ctx.session?.address?.toLowerCase()
  ) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Only the deployer of the token can perform this action",
    });
  }
}
