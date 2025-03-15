import { TRPCError } from "@trpc/server";
import { always } from "rambda";
import { z } from "zod";

import { suiChainConfig } from "~/config/chains";
import { protectedProcedure } from "~/server/trpc";
import type { NewRemoteInterchainTokenInput } from "~/services/db/postgres";

const remoteInterchainTokenSchema = z.object({
  axelarChainId: z.string(),
});

export const recordRemoteTokensDeployment = protectedProcedure
  .input(
    z.object({
      chainId: z.number(),
      axelarChainId: z.string().optional(),
      deploymentMessageId: z.string(),
      tokenAddress: z.string(),
      remoteTokens: z.array(remoteInterchainTokenSchema),
    })
  )
  .mutation(async ({ ctx, input }) => {
    // Get both EVM and VM chains
    const [evmChains, vmChains] = await Promise.all([
      ctx.configs.evmChains(),
      ctx.configs.vmChains(),
    ]);

    const configs =
      evmChains[input.chainId] ||
      vmChains[input?.axelarChainId || suiChainConfig.axelarChainId];
    if (!configs) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `No configuration found for chain ID ${input.chainId}`,
      });
    }

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
        // Get configs for remote chain
        const remoteEvmConfig = evmChains[remoteToken.axelarChainId];
        const remoteVmConfig = vmChains[remoteToken.axelarChainId];
        const remoteConfig = remoteEvmConfig || remoteVmConfig;

        if (!remoteConfig) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: `No configuration found for remote chain ${remoteToken.axelarChainId}`,
          });
        }

        let tokenManagerAddress: string = "0x";
        let tokenAddress: string = "0x";

        if (
          !remoteToken.axelarChainId.includes("sui") &&
          !remoteToken.axelarChainId.includes("stellar")
        ) {
          // Create appropriate client based on chain type
          const itsClient = ctx.contracts.createInterchainTokenServiceClient(
            remoteConfig.wagmi
          );

          if (!itsClient) {
            throw new TRPCError({
              code: "NOT_IMPLEMENTED",
              message: `Chain type ${remoteConfig.info.chain_name} not supported yet`,
            });
          }

          [tokenManagerAddress, tokenAddress] = await Promise.all([
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
        } else {
          // Use placeholders for Sui, to be updated later
          tokenAddress = originToken.tokenAddress;
          tokenManagerAddress = originToken.tokenManagerAddress ?? "0x";
        }

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

    try {
      return ctx.persistence.postgres.recordRemoteInterchainTokenDeployments(
        remoteTokens as NewRemoteInterchainTokenInput[]
      );
    } catch (error: any) {
      if (error.message.includes("duplicate key")) {
        console.warn(
          `Remote tokens for ${input.tokenAddress} on chain ${input.chainId} already recorded`
        );
        return;
      }

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Failed to record remote tokens deployment: ${error.message}`,
      });
    }
  });
