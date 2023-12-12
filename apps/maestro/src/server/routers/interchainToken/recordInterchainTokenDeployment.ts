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

    const chains = await ctx.configs.evmChains();
    const configs = chains[input.axelarChainId];

    const originChainServiceClient =
      ctx.contracts.createInterchainTokenServiceClient(configs.wagmi);

    const tokenManagerAddress =
      await originChainServiceClient.reads.tokenManagerAddress({
        tokenId: input.tokenId as `0x${string}`,
      });

    await ctx.persistence.postgres.recordInterchainTokenDeployment({
      ...input,
      tokenManagerAddress,
    });

    if (!input.destinationAxelarChainIds.length) {
      return;
    }

    const remoteTokens = await Promise.all(
      input.destinationAxelarChainIds.map(async (axelarChainId) => {
        const chains = await ctx.configs.evmChains();
        const configs = chains[axelarChainId];

        const itsClient = ctx.contracts.createInterchainTokenServiceClient(
          configs.wagmi
        );
        const [tokenManagerAddress, tokenAddress] = await Promise.all([
          itsClient.reads.tokenManagerAddress({
            tokenId: input.tokenId as `0x${string}`,
          }),
          itsClient.reads.interchainTokenAddress({
            tokenId: input.tokenId as `0x${string}`,
          }),
        ]);

        return {
          tokenAddress,
          axelarChainId,
          tokenManagerAddress,
          tokenId: input.tokenId,
          deployerAddress: input.deployerAddress,
          deploymentMessageId: input.deploymentMessageId,
          deploymentStatus: "pending" as const,
        };
      })
    );

    await ctx.persistence.postgres.recordRemoteInterchainTokenDeployments(
      remoteTokens
    );
  });
