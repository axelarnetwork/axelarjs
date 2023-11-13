import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { hex40Literal } from "~/lib/utils/validation";
import { protectedProcedure } from "~/server/trpc";
import { remoteInterchainTokenSchema } from "~/services/db/kv";

export const recordRemoteTokensDeployment = protectedProcedure
  .input(
    z.object({
      chainId: z.number(),
      tokenAddress: hex40Literal(),
      remoteTokens: z.array(remoteInterchainTokenSchema),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const originToken =
      await ctx.persistence.postgres.getInterchainTokenByChainIdAndTokenAddress(
        input.chainId,
        input.tokenAddress
      );

    if (!originToken) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Could not find interchain token details for ${input.tokenAddress} on chain ${input.chainId}`,
      });
    }

    if (originToken.deployerAddress !== ctx.session?.address) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: `Only the deployer of the token can record remote tokens`,
      });
    }

    return ctx.persistence.postgres.recordRemoteInterchainTokenDeployments(
      input.remoteTokens.map((remoteToken) => ({
        tokenId: originToken.tokenId,
        originTokenId: originToken.tokenId,
        address: originToken.tokenAddress,
        deploymentTxHash: remoteToken.deploymentTxHash,
        deploymentStatus: remoteToken.deploymentStatus,
        chainId: remoteToken.chainId,
        axelarChainId: remoteToken.axelarChainId,
        deploymentLogIndex: remoteToken.deploymentLogIndex,
      }))
    );
  });
