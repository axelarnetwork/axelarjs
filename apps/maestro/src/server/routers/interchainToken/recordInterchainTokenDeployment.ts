import { invariant } from "@axelarjs/utils";

import type { z } from "zod";

import { protectedProcedure } from "~/server/trpc";
import { interchainTokenDetailsBaseSchema } from "~/services/db/kv";

export type RecordInterchainTokenDeploymentInput = z.infer<
  typeof interchainTokenDetailsBaseSchema
>;

export const recordInterchainTokenDeployment = protectedProcedure
  .input(interchainTokenDetailsBaseSchema)
  .mutation(async ({ ctx, input }) => {
    invariant(ctx.session?.address, "ctx.session.address is required");

    // await ctx.persistence.postgres.recordInterchainTokenDeployment({
    //   deployerAddress: ctx.session.address,
    //   ...input,
    // });

    // await ctx.persistence.postgres.recordRemoteInterchainTokenDeployments(
    //   input.remoteTokens.map((remoteToken) => ({
    //     tokenId: input.tokenId,
    //     originTokenId: input.tokenId,
    //     address: input.tokenAddress,
    //     deploymentTxHash: remoteToken.deploymentTxHash,
    //     deploymentStatus: remoteToken.deploymentStatus,
    //     chainId: remoteToken.chainId,
    //     axelarChainId: remoteToken.axelarChainId,
    //     deploymentLogIndex: remoteToken.deploymentLogIndex,
    //   }))
    // );

    await ctx.persistence.kv
      .recordInterchainTokenDeployment(
        {
          chainId: input.chainId,
          tokenAddress: input.tokenAddress,
        },
        {
          ...input,
          deployerAddress: ctx.session.address,
        }
      )
      .catch((e) => console.log("error recordInterchainTokenDeployment", e));
  });
