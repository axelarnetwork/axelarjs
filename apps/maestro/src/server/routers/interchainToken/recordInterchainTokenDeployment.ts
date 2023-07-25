import { invariant } from "@axelarjs/utils";

import type { z } from "zod";

import { protectedProcedure } from "~/server/trpc";
import { interchainTokenDetailsBaseSchema } from "~/services/kv";

export type RecordInterchainTokenDeploymentInput = z.infer<
  typeof interchainTokenDetailsBaseSchema
>;

export const recordInterchainTokenDeployment = protectedProcedure
  .input(interchainTokenDetailsBaseSchema)
  .mutation(async ({ ctx, input }) => {
    invariant(ctx.session?.address, "ctx.session.address is required");

    await ctx.storage.kv
      .recordInterchainTokenDeployment(
        {
          chainId: input.originChainId,
          tokenAddress: input.tokenAddress,
        },
        {
          ...input,
          deployerAddress: ctx.session.address,
        }
      )
      .catch((e) => console.log("error recordInterchainTokenDeployment", e));
  });
