import { invariant, Maybe } from "@axelarjs/utils";

import { always } from "rambda";
import { z } from "zod";

import { getTokenManagerTypeFromBigInt } from "~/lib/drizzle/schema/common";
import { EvmChainsValue } from "~/server/chainConfig";
import { protectedProcedure } from "~/server/trpc";
import {
  newInterchainTokenSchema,
  type NewRemoteInterchainTokenInput,
} from "~/services/db/postgres";

const recordInterchainTokenDeploymentInput = newInterchainTokenSchema.extend({
  destinationAxelarChainIds: z.array(z.string()),
});

export type RecordInterchainTokenDeploymentInput = z.infer<
  typeof recordInterchainTokenDeploymentInput
>;

export const recordInterchainTokenDeployment = protectedProcedure
  .input(recordInterchainTokenDeploymentInput)
  .mutation(async ({ ctx, input }) => {
    invariant(ctx.session?.address, "ctx.session.address is required");
    let tokenManagerAddress;
    let tokenManagerType;
    const chains = await ctx.configs.chains();
    const configs = chains[input.axelarChainId];

    // Evm chains
    if (configs.info.chain_type === "evm") {
      const evmConfigs = configs as EvmChainsValue;
      invariant(
        evmConfigs,
        `No configuration found for chain ${input.axelarChainId}`
      );

      // Handle different chain types
      const createServiceClient = () => {
        return ctx.contracts.createInterchainTokenServiceClient(
          evmConfigs.wagmi
        );
      };

      const originChainServiceClient = createServiceClient();

      tokenManagerAddress = (await originChainServiceClient.reads
        .tokenManagerAddress({
          tokenId: input.tokenId as `0x${string}`,
        })
        .catch(() => null)) as `0x${string}`;

      const createTokenManagerClient = (address: string) => {
        return ctx.contracts.createTokenManagerClient(
          evmConfigs.wagmi,
          address
        );
      };

      const tokenManagerClient = !tokenManagerAddress
        ? null
        : createTokenManagerClient(tokenManagerAddress);

      const tokenManagerTypeCode = !tokenManagerClient
        ? null
        : await tokenManagerClient.reads.implementationType().catch(() => null);

      tokenManagerType = Maybe.of(tokenManagerTypeCode).mapOr(
        // default to mint_burn for interchain tokens
        // and lock_unlock for canonical tokens
        input.kind === "canonical" ? "lock_unlock" : "mint_burn",
        (value) => getTokenManagerTypeFromBigInt(value as bigint)
      );
    } else {
      // TODO: verify this info on chain
      tokenManagerAddress = input.tokenManagerAddress;
      tokenManagerType = input.tokenManagerType;
    }

    await ctx.persistence.postgres.recordInterchainTokenDeployment({
      ...input,
      tokenManagerAddress,
      tokenManagerType,
    });

    if (!input.destinationAxelarChainIds.length) {
      return;
    }

    const remoteTokens = await Promise.all(
      input.destinationAxelarChainIds.map(async (axelarChainId) => {
        const chainConfig = chains[axelarChainId];
        invariant(
          chainConfig,
          `No configuration found for chain ${axelarChainId}`
        );
        let tokenAddress;
        let tokenManagerAddress;

        if (chainConfig.info.chain_type === "evm") {
          const evmChainConfig = chainConfig as EvmChainsValue;
          invariant(
            evmChainConfig.wagmi,
            `No wagmi configuration found for chain ${axelarChainId}`
          );
          const itsClient = ctx.contracts.createInterchainTokenServiceClient(
            evmChainConfig.wagmi
          );

          [tokenManagerAddress, tokenAddress] = await Promise.all([
            itsClient.reads
              .tokenManagerAddress({
                tokenId: input.tokenId as `0x${string}`,
              })
              .catch(always("0x")),
            itsClient.reads
              .interchainTokenAddress({
                tokenId: input.tokenId as `0x${string}`,
              })
              .catch(always(input.tokenAddress)),
          ]);
        } else {
          // the address should be different from the address in the origin chain
          // but this will be updated later in tokens page
          tokenAddress = input.tokenAddress;
          tokenManagerAddress = input.tokenManagerAddress;
        }

        return {
          tokenAddress,
          axelarChainId,
          tokenManagerAddress,
          tokenManagerType,
          tokenId: input.tokenId,
          deployerAddress: input.deployerAddress,
          deploymentMessageId: input.deploymentMessageId,
          originalMinterAddress: input.originalMinterAddress,
          deploymentStatus: "pending" as const,
        };
      })
    );

    await ctx.persistence.postgres.recordRemoteInterchainTokenDeployments(
      remoteTokens as NewRemoteInterchainTokenInput[]
    );
  });
