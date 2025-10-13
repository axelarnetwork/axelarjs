import * as xrpl from "xrpl";
import { z } from "zod";

import { publicProcedure, router } from "~/server/trpc";
import { buildInterchainTransferTxBytes } from "./utils/tokenOperations";
import { getXRPLChainConfig, parseXRPLTokenAddress } from "./utils/utils";

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
    .query(async ({ ctx, input }) => {
      const xrplConfig = await getXRPLChainConfig(ctx);
      const client = new xrpl.Client(xrplConfig.config.rpc[0]);
      await client.connect();
      try {
        if (input.tokenAddress === "XRP") {
          // Native XRP doesn't require a trust line
          return { hasTrustLine: true };
        }
        const parsed = parseXRPLTokenAddress(input.tokenAddress);
        if (!parsed) {
          return { hasTrustLine: true };
        }
        const { currency, issuer } = parsed;
        const res = await client.request({
          command: "account_lines",
          account: input.account,
          peer: issuer,
        });
        const has = res.result.lines?.some((l: any) => l.currency === currency);
        return { hasTrustLine: !!has };
      } finally {
        try {
          await client.disconnect();
        } catch (e) {
          console.error("Error disconnecting from XRPL client", e);
        }
      }
    }),
  getTrustSetTxBytes: publicProcedure
    .input(
      z.object({
        account: z.string(),
        tokenAddress: z.string(),
        limit: z.string().default("999999999999"), // default large limit
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (input.tokenAddress === "XRP") {
        throw new Error("XRP does not require a trust line");
      }
      const parsed = parseXRPLTokenAddress(input.tokenAddress);
      if (!parsed) {
        throw new Error("Invalid token address for trust line");
      }
      const xrplConfig = await getXRPLChainConfig(ctx);
      const client = new xrpl.Client(xrplConfig.config.rpc[0]);
      await client.connect();
      try {
        const tx: xrpl.TrustSet = {
          TransactionType: "TrustSet",
          Account: input.account,
          LimitAmount: {
            currency: parsed.currency,
            issuer: parsed.issuer,
            value: input.limit,
          },
        };
        const prepared = await client.autofill(tx);
        const txBase64 = xrpl.encode(prepared);
        return { txBase64 };
      } finally {
        try {
          await client.disconnect();
        } catch (e) {
          console.error("Error disconnecting from XRPL client", e);
        }
      }
    }),
});
