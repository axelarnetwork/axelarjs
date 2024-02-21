import { createCallerFactory, publicProcedure, router } from "~/server/trpc";
import { createContext } from "../context";
import { accountsRouter } from "./accounts";
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
  accounts: accountsRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = async (
  ...args: Parameters<typeof createContext>
) => {
  const fn = createCallerFactory(appRouter);
  const ctx = await createContext(...args);
  return fn(ctx);
};
