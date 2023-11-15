import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { hex40Literal } from "~/lib/utils/validation";
import { protectedProcedure } from "~/server/trpc";

const remoteInterchainTokenSchema = z.object({
  axelarChainId: z.string(),
});

export const recordRemoteTokensDeployment = protectedProcedure
  .input(
    z.object({
      axelarChainId: z.string(),
      deploymentMessageId: z.string(),
      tokenAddress: hex40Literal(),
      remoteTokens: z.array(remoteInterchainTokenSchema),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const originToken =
      await ctx.persistence.postgres.getInterchainTokenByChainIdAndTokenAddress(
        input.axelarChainId,
        input.tokenAddress
      );

    if (!originToken) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Could not find interchain token details for ${input.tokenAddress} on chain ${input.axelarChainId}`,
      });
    }

    if (originToken.deployerAddress !== ctx.session?.address) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: `Only the deployer of the token can record remote tokens`,
      });
    }

    const remoteTokens = await Promise.all(
      input.remoteTokens.map(async (remoteToken) => {
        const config = ctx.configs.evmChains[remoteToken.axelarChainId];

        const itsClient = ctx.contracts.createInterchainTokenServiceClient(
          config.wagmi
        );

        const tokenManagerAddress = await itsClient.reads.tokenManagerAddress({
          tokenId: originToken.tokenId as `0x${string}`,
        });

        return {
          tokenManagerAddress,
          tokenId: originToken.tokenId,
          axelarChainId: remoteToken.axelarChainId,
          deploymentStatus: "pending" as const,
          tokenAddress: input.tokenAddress,
          deploymentMessageId: input.deploymentMessageId,
        };
      })
    );

    return ctx.persistence.postgres.recordRemoteInterchainTokenDeployments(
      remoteTokens
    );
  });
