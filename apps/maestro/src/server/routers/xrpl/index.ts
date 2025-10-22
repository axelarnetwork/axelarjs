import { TRPCError } from "@trpc/server";
import * as xrpl from "xrpl";
import { z } from "zod";

import { publicProcedure, router } from "~/server/trpc";
import { buildInterchainTransferTxBytes } from "./utils/tokenOperations";
import { parseXRPLTokenAddress } from "./utils/utils";
import { withXRPLClient } from "~/lib/utils/xrpl";

export const xrplRouter = router({
  getInterchainTransferTxBytes: publicProcedure
    .input(
      z.object({
        caller: z.string(),
        tokenId: z.string(),
        tokenAddress: z.string(),
        destinationChain: z.string(),
        destinationAddress: z.string(),
        amount: z.string(),
        gasValue: z.string().default("0"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return buildInterchainTransferTxBytes(ctx, input);
    }),
  checkTrustLine: publicProcedure
    .input(
      z.object({
        account: z.string(),
        tokenAddress: z.string(),
      })
    )
    .query(async ({ input }) => {
      if (input.tokenAddress === "XRP") {
        // Native XRP doesn't require a trust line
        return { hasTrustLine: true };
      }
      let parsed;
      try {
        parsed = parseXRPLTokenAddress(input.tokenAddress);
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid token address for trust line",
        });
      }
      if (!parsed) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Assertion failed",
        });
      }
      const { currency, issuer } = parsed;
      const res = await withXRPLClient(async (client) => {
        return await client.request({
          command: "account_lines",
          account: input.account,
          peer: issuer,
        });
      });

      const has = res.result.lines?.some(
        (l: xrpl.AccountLinesTrustline) => l.currency === currency
      );
      return { hasTrustLine: !!has };
    }),
  getTrustSetTxBytes: publicProcedure
    .input(
      z.object({
        account: z.string(),
        tokenAddress: z.string(),
        limit: z.string().default("999999999999"), // default large limit
      })
    )
    .mutation(async ({ input }) => {
      if (input.tokenAddress === "XRP") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "XRP does not require a trust line",
        });
      }
      let parsed;
      try {
        parsed = parseXRPLTokenAddress(input.tokenAddress);
        if(!parsed)
          throw Error("Assertion failed");
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid token address for trust line",
        });
      }

      const tx: xrpl.TrustSet = {
        TransactionType: "TrustSet",
        Account: input.account,
        LimitAmount: {
          currency: parsed.currency,
          issuer: parsed.issuer,
          value: input.limit,
        },
      };
      const prepared = await withXRPLClient(async (client) => {
        return await client.autofill(tx);
      });

      const txBase64 = xrpl.encode(prepared);
      return { txBase64 };
    }),
});
