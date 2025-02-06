import { invariant, Maybe } from "@axelarjs/utils";

import { always, chain } from "rambda";
import { z } from "zod";

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

    if (input.axelarChainId !== "sui") {
      const evmChains = await ctx.configs.evmChains();
      const vmChains = await ctx.configs.vmChains();
      const configs =
        evmChains[input.axelarChainId] || vmChains[input.axelarChainId];

      invariant(
        configs,
        `No configuration found for chain ${input.axelarChainId}`
      );

      // Handle different chain types
      const createServiceClient = () => {
        return ctx.contracts.createInterchainTokenServiceClient(configs.wagmi);
      };

      const originChainServiceClient = createServiceClient();

      tokenManagerAddress = (await originChainServiceClient.reads
        .tokenManagerAddress({
          tokenId: input.tokenId as `0x${string}`,
        })
        .catch(() => null)) as `0x${string}`;

      const createTokenManagerClient = (address: string) => {
        return ctx.contracts.createTokenManagerClient(configs.wagmi, address);
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
      tokenManagerAddress: tokenManagerAddress as string,
      tokenManagerType,
    });

    if (!input.destinationAxelarChainIds.length) {
      return;
    }

    const remoteTokens = await Promise.all(
      input.destinationAxelarChainIds.map(async (axelarChainId) => {
        // Fetch both chain types
        const vmChains = await ctx.configs.vmChains();
        const evmChains = await ctx.configs.evmChains();

        // Create a Map using chain_id as the key to ensure uniqueness
        const uniqueChains = new Map();

        // Add VM chains first, accessing the 'info' property
        Object.values(vmChains).forEach((chainConfig) => {
          uniqueChains.set(chainConfig.info.chain_id, chainConfig);
        });

        // Add EVM chains, overwriting any duplicates
        Object.values(evmChains).forEach((chainConfig) => {
          uniqueChains.set(chainConfig.info.chain_id, chainConfig);
        });

        // Convert back to an object with axelarChainId as keys
        const chains = Array.from(uniqueChains.values()).reduce(
          (acc, chainConfig) => {
            acc[chainConfig.info.id] = chainConfig;
            return acc;
          },
          {} as Record<string, typeof chain>
        );

        const chainConfig = chains[axelarChainId];
        invariant(
          chainConfig,
          `No configuration found for chain ${axelarChainId}`
        );
        invariant(
          chainConfig.wagmi,
          `No wagmi configuration found for chain ${axelarChainId}`
        );
        let tokenAddress;
        let tokenManagerAddress;

        if (axelarChainId !== "sui") {
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
              .registeredTokenAddress({
                tokenId: input.tokenId as `0x${string}`,
              })
              .catch(always("0x")),
          ]);
        } else {
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

    const validTokens = remoteTokens.filter(
      (token) => token.tokenAddress !== "0x"
    );

    if (validTokens.length !== remoteTokens.length) {
      console.log(
        "recordInterchainTokenDeployment: some tokens are not valid",
        {
          invalidTokens: remoteTokens.filter(
            (token) => token.tokenAddress === "0x"
          ),
        }
      );
    }

    await ctx.persistence.postgres.recordRemoteInterchainTokenDeployments(
      validTokens as NewRemoteInterchainTokenInput[]
    );
  });
