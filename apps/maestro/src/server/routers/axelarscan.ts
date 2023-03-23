import { TRPCError } from "@trpc/server";

import { publicProcedure, router } from "~/server/trpc";

export const axelarscanRouter = router({
  getChainConfigs: publicProcedure.query(async ({ ctx }) => {
    try {
      const response = await ctx.services.axelarscan.getChainConfigs();

      return response;
    } catch (error) {
      // If we get a TRPC error, we throw it
      if (error instanceof TRPCError) {
        throw error;
      }
      // otherwise, we throw an internal server error
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to get chain configs",
      });
    }
  }),
});

export type AxelarscanRouter = typeof axelarscanRouter;
