import { publicProcedure, router } from "~/server/trpc";

import { axelarscanRouter } from "./axelarscan";
import { erc20Router } from "./erc20";
import { gmpRouter } from "./gmp";

export const appRouter = router({
  uptime: publicProcedure.query(async () => ({
    uptime: process.uptime(),
  })),
  gmp: gmpRouter,
  axelarscan: axelarscanRouter,
  erc20: erc20Router,
});

export type AppRouter = typeof appRouter;
