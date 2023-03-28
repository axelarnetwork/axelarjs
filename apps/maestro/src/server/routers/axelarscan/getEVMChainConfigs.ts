import { TRPCError } from "@trpc/server";

import { DISABLED_CHAINS } from "~/config/chains";
import { publicProcedure } from "~/server/trpc";

export const getEVMChainConfigs = publicProcedure.query(async ({ ctx }) => {
  try {
    const { evm } = await ctx.services.axelarscan.getChainConfigs();

    return evm.filter(
      (chain) => !(DISABLED_CHAINS.has(chain.chain_id) || chain.deprecated)
    );
  } catch (error) {
    // If we get a TRPC error, we throw it
    if (error instanceof TRPCError) {
      throw error;
    }
    // otherwise, we throw an internal server error
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to get chain config",
    });
  }
});
