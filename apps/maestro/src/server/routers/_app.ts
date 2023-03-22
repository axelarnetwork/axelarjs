import { publicProcedure, router } from "~/server/trpc";

import { axelarscanRouter } from "./axelarscan";
import { gmpRouter } from "./gmp";

export const appRouter = router({
  uptime: publicProcedure.query(async () => ({
    uptime: process.uptime(),
  })),
  gmp: gmpRouter,
  axelarscan: axelarscanRouter,
});

export type AppRouter = typeof appRouter;
