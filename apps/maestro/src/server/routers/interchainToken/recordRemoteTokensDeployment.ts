import { TRPCError } from "@trpc/server";
import { always } from "rambda";
import { z } from "zod";

import { hex40Literal } from "~/lib/utils/validation";
import { protectedProcedure } from "~/server/trpc";
import type { NewRemoteInterchainTokenInput } from "~/services/db/postgres";

const remoteInterchainTokenSchema = z.object({
  axelarChainId: z.string(),
});

export const recordRemoteTokensDeployment = protectedProcedure
  .input(
    z.object({
      chainId: z.number(),
      deploymentMessageId: z.string(),
      tokenAddress: hex40Literal(),
      remoteTokens: z.array(remoteInterchainTokenSchema),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const chains = await ctx.configs.evmChains();
    const configs = chains[input.chainId];

    const originToken =
      await ctx.persistence.postgres.getInterchainTokenByChainIdAndTokenAddress(
        configs.info.id,
        input.tokenAddress
      );

    if (!originToken) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Could not find interchain token details for ${input.tokenAddress} on chain ${input.chainId}`,
      });
    }

    if (
      originToken.kind === "interchain" &&
      originToken.deployerAddress !== ctx.session?.address
    ) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: `Only the deployer of the token can record remote tokens`,
      });
    }

    if (!input.remoteTokens.length) {
      console.warn(
        `No remote tokens provided for ${input.tokenAddress} on chain ${input.chainId}`
      );
      return;
    }

    const remoteTokens = await Promise.all(
      input.remoteTokens.map(async (remoteToken) => {
        const chains = await ctx.configs.evmChains();
        const configs = chains[remoteToken.axelarChainId];

        const itsClient = ctx.contracts.createInterchainTokenServiceClient(
          configs.wagmi
        );

        const [tokenManagerAddress, tokenAddress] = await Promise.all([
          itsClient.reads
            .tokenManagerAddress({
              tokenId: originToken.tokenId as `0x${string}`,
            })
            .catch(always("0x")),
          itsClient.reads
            .interchainTokenAddress({
              tokenId: originToken.tokenId as `0x${string}`,
            })
            .catch(always("0x")),
        ]);

        return {
          tokenManagerAddress,
          tokenManagerType: "mint_burn" as const,
          tokenAddress,
          tokenId: originToken.tokenId,
          axelarChainId: remoteToken.axelarChainId,
          deploymentStatus: "pending" as const,
          deploymentMessageId: input.deploymentMessageId,
        };
      })
    );

    return ctx.persistence.postgres.recordRemoteInterchainTokenDeployments(
      remoteTokens as NewRemoteInterchainTokenInput[]
    );
  });
