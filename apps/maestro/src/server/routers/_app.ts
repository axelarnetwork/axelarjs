import { publicProcedure, router } from "~/server/trpc";
import { authRouter } from "./auth";
import { axelarjsSDKRouter } from "./axelarjsSDK";
import { axelarscanRouter } from "./axelarscan";
import { erc20Router } from "./erc20";
import { gmpRouter } from "./gmp";
import { interchainTokenRouter } from "./interchainToken";
import { openaiRouter } from "./openai";

export const appRouter = router({
  uptime: publicProcedure.query(() => ({
    uptime: process.uptime(),
  })),
  gmp: gmpRouter,
  axelarscan: axelarscanRouter,
  erc20: erc20Router,
  axelarjsSDK: axelarjsSDKRouter,
  interchainToken: interchainTokenRouter,
  auth: authRouter,
  openai: openaiRouter,
});

export type AppRouter = typeof appRouter;
