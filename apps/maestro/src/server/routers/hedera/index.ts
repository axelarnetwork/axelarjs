import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { NEXT_PUBLIC_NETWORK_ENV } from "~/config/env";
import { publicProcedure, router } from "~/server/trpc";

export const hederaRouter = router({
  checkAssociation: publicProcedure
    .input(
      z.object({
        tokenAddress: z.string(),
        accountAddress: z.string(),
      })
    )
    .query(async ({ input }) => {
      const { tokenAddress, accountAddress } = input;

      const API_URL =
        NEXT_PUBLIC_NETWORK_ENV === "mainnet"
          ? "https://mainnet-public.mirrornode.hedera.com/api/v1"
          : "https://testnet-public.mirrornode.hedera.com/api/v1";

      const tokenResp = await fetch(`${API_URL}/tokens/${tokenAddress}`);
      if (!tokenResp.ok) {
        if (tokenResp.status === 404) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Token not found",
          });
        }
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `API token lookup failed (${tokenResp.status})`,
        });
      }
      const tokenId = ((await tokenResp.json()) as { token_id?: string })
        .token_id;
      if (!tokenId) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Token not found" });
      }

      const assocResp = await fetch(
        `${API_URL}/accounts/${accountAddress}/tokens?token.id=${tokenId}`
      );
      if (!assocResp.ok) {
        if (assocResp.status === 404) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Account not found",
          });
        }
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `API relationship lookup failed (${assocResp.status})`,
        });
      }
      const tokens = ((await assocResp.json()) as { tokens?: unknown[] })
        .tokens;
      const isAssociated = (tokens?.length ?? 0) > 0;

      return { isAssociated, tokenId } as const;
    }),
});
