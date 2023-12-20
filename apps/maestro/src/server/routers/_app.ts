import { publicProcedure, router } from "~/server/trpc";
import { authRouter } from "./auth";
import { axelarConfigsRouter } from "./axelarConfigs";
import { axelarjsSDKRouter } from "./axelarjsSDK";
import { axelarscanRouter } from "./axelarscan";
import { erc20Router } from "./erc20";
import { gmpRouter } from "./gmp";
import { interchainTokenRouter } from "./interchainToken";
import { messagesRouter } from "./messages";
import { openaiRouter } from "./openai";

export const appRouter = router({
  uptime: publicProcedure.query(() => ({
    uptime: process.uptime(),
  })),
  gmp: gmpRouter,
  axelarscan: axelarscanRouter,
  erc20: erc20Router,
  axelarjsSDK: axelarjsSDKRouter,
  axelarConfigs: axelarConfigsRouter,
  interchainToken: interchainTokenRouter,
  auth: authRouter,
  openai: openaiRouter,
  messages: messagesRouter,
});

export type AppRouter = typeof appRouter;
