import { createCallerFactory, publicProcedure, router } from "~/server/trpc";
import { createContext } from "../context";
import { accountsRouter } from "./accounts";
import { authRouter } from "./auth";
import { axelarConfigsRouter } from "./axelarConfigs";
import { axelarjsSDKRouter } from "./axelarjsSDK";
import { gmpRouter } from "./gmp";
import { healthcheckRouter } from "./healthcheck";
import { interchainTokenRouter } from "./interchainToken";
import { messagesRouter } from "./messages";
import { nativeTokensRouter } from "./nativeTokens";
import { openaiRouter } from "./openai";
import { stellarRouter } from "./stellar";
import { suiRouter } from "./sui";

export const appRouter = router({
  uptime: publicProcedure.query(() => ({
    uptime: process.uptime(),
  })),
  gmp: gmpRouter,
  nativeTokens: nativeTokensRouter,
  axelarjsSDK: axelarjsSDKRouter,
  axelarConfigs: axelarConfigsRouter,
  interchainToken: interchainTokenRouter,
  auth: authRouter,
  openai: openaiRouter,
  messages: messagesRouter,
  accounts: accountsRouter,
  sui: suiRouter,
  stellar: stellarRouter,
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
