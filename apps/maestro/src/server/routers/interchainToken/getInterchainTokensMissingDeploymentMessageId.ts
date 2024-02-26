import { TRPCError } from "@trpc/server";

import { publicProcedure } from "~/server/trpc";

export const getInterchainTokensMissingDeploymentMessageId =
  publicProcedure.query(async ({ ctx }) => {
    const results =
      await ctx.persistence.postgres.getInterchainTokensMissingDeploymentMessageId();

    if (!results) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "No interchain tokens missing deploymentMessageId found",
      });
    }

    return results;
  });
