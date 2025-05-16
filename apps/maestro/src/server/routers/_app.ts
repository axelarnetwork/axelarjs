import { createCallerFactory, publicProcedure, router } from "~/server/trpc";
import { createContext } from "../context";
import { accountsRouter } from "./accounts";
import { authRouter } from "./auth";
import { axelarConfigsRouter } from "./axelarConfigs";
import { axelarjsSDKRouter } from "./axelarjsSDK";
import { axelarscanRouter } from "./axelarscan";
import { gmpRouter } from "./gmp";
import { interchainTokenRouter } from "./interchainToken";
import { messagesRouter } from "./messages";
import { nativeTokensRouter } from "./nativeTokens";
import { openaiRouter } from "./openai";
import { suiRouter } from "./sui";
import { healthcheckRouter } from "./healthcheck";

export const appRouter = router({
  uptime: publicProcedure.query(() => ({
    uptime: process.uptime(),
  })),
  gmp: gmpRouter,
  axelarscan: axelarscanRouter,
  nativeTokens: nativeTokensRouter,
  axelarjsSDK: axelarjsSDKRouter,
  axelarConfigs: axelarConfigsRouter,
  interchainToken: interchainTokenRouter,
  auth: authRouter,
  openai: openaiRouter,
  messages: messagesRouter,
  accounts: accountsRouter,
  sui: suiRouter,
  healthcheck: healthcheckRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = async (
  ...args: Parameters<typeof createContext>
) => {
  const createCallerInner = createCallerFactory(appRouter);
  const ctx = await createContext(...args);
  return createCallerInner(ctx);
};
