import { invariant } from "@axelarjs/utils";

import { z } from "zod";

import { protectedProcedure } from "~/server/trpc";
import { newInterchainTokenSchema } from "~/services/db/postgres";

const recordInterchainTokenDeploymentInput = newInterchainTokenSchema
  .extend({
    destinationAxelarChainIds: z.array(z.string()),
  })
  .omit({
    tokenManagerAddress: true,
  });

export type RecordInterchainTokenDeploymentInput = z.infer<
  typeof recordInterchainTokenDeploymentInput
>;

export const recordInterchainTokenDeployment = protectedProcedure
  .input(recordInterchainTokenDeploymentInput)
  .mutation(async ({ ctx, input }) => {
    invariant(ctx.session?.address, "ctx.session.address is required");

    const config = ctx.configs.evmChains[input.axelarChainId];

    const originChainServiceClient =
      ctx.contracts.createInterchainTokenServiceClient(config.wagmi);

    const tokenManagerAddress =
      await originChainServiceClient.reads.tokenManagerAddress({
        tokenId: input.tokenId as `0x${string}`,
      });

    await ctx.persistence.postgres.recordInterchainTokenDeployment({
      ...input,
      tokenManagerAddress,
    });

    const remoteTokens = await Promise.all(
      input.destinationAxelarChainIds.map(async (axelarChainId) => {
        const remoteChainConfig = ctx.configs.evmChains[axelarChainId];

        const remoteChainServiceClient =
          ctx.contracts.createInterchainTokenServiceClient(
            remoteChainConfig.wagmi
          );

        const tokenManagerAddress =
          await remoteChainServiceClient.reads.tokenManagerAddress({
            tokenId: input.tokenId as `0x${string}`,
          });

        return {
          axelarChainId,
          tokenManagerAddress,
          tokenId: input.tokenId,
          tokenAddress: input.tokenAddress,
          deployerAddress: ctx.session!.address,
          deploymentMessageId: input.deploymentMessageId,
          deploymentStatus: "pending" as const,
        };
      })
    );

    await ctx.persistence.postgres.recordRemoteInterchainTokenDeployments(
      remoteTokens
    );
  });
