import { invariant, Maybe } from "@axelarjs/utils";

import { always } from "rambda";
import { z } from "zod";
import { ExtendedWagmiChainConfig } from "~/config/chains";

import { getTokenManagerTypeFromBigInt } from "~/lib/drizzle/schema/common";
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

    if (!input.axelarChainId.includes("sui")) {
      const configs = chains[input.axelarChainId];

      invariant(
        configs,
        `No configuration found for chain ${input.axelarChainId}`
      );

      invariant(
        configs.wagmi,
        `No wagmi configuration found for chain ${input.axelarChainId}`
      );

      // Handle different chain types
      const createServiceClient = () => {
        return ctx.contracts.createInterchainTokenServiceClient(configs.wagmi as ExtendedWagmiChainConfig);
      };

      const originChainServiceClient = createServiceClient();

      tokenManagerAddress = (await originChainServiceClient.reads
        .tokenManagerAddress({
          tokenId: input.tokenId as `0x${string}`,
        })
        .catch(() => null)) as `0x${string}`;

      const createTokenManagerClient = (address: string) => {
        return ctx.contracts.createTokenManagerClient(configs.wagmi as ExtendedWagmiChainConfig, address);
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

        if (!axelarChainId.includes("sui")) {
          invariant(
            chainConfig.wagmi,
            `No wagmi configuration found for chain ${axelarChainId}`
          );
          const itsClient = ctx.contracts.createInterchainTokenServiceClient(
            chainConfig.wagmi
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
        } else if (axelarChainId.includes("sui")) {
          // the address should be different from the address in the origin chain
          // but this will be updated later in tokens page
          tokenAddress = input.tokenAddress;
          tokenManagerAddress = input.tokenManagerAddress;
        }

        return {
          tokenAddress,
          axelarChainId,
          tokenManagerAddress,
          tokenManagerType: "mint_burn" as const,
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
