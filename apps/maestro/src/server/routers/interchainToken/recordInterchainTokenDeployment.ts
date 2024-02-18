import { invariant, Maybe } from "@axelarjs/utils";

import { always } from "rambda";
import { z } from "zod";

import { getTokenManagerTypeFromBigInt } from "~/lib/drizzle/schema/common";
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

    const tokenManagerAddress = await originChainServiceClient.reads
      .tokenManagerAddress({
        tokenId: input.tokenId as `0x${string}`,
      })
      .catch(() => null);

    const tokenManagerClient = !tokenManagerAddress
      ? null
      : ctx.contracts.createTokenManagerClient(
          configs.wagmi,
          tokenManagerAddress
        );

    const tokenManagerTypeCode = !tokenManagerClient
      ? null
      : await tokenManagerClient.reads.implementationType().catch(() => null);

    const tokenManagerType = Maybe.of(tokenManagerTypeCode).mapOr(
      // default to mint_burn for interchain tokens
      // and lock_unlock for canonical tokens
      input.kind === "canonical" ? "lock_unlock" : "mint_burn",
      getTokenManagerTypeFromBigInt
    );

    await ctx.persistence.postgres.recordInterchainTokenDeployment({
      ...input,
      tokenManagerAddress: tokenManagerAddress as `0x${string}`,
      tokenManagerType,
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
          itsClient.reads
            .tokenManagerAddress({
              tokenId: input.tokenId as `0x${string}`,
            })
            .catch(always("0x")),
          itsClient.reads
            .interchainTokenAddress({
              tokenId: input.tokenId as `0x${string}`,
            })
            .catch(always("0x")),
        ]);

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
      validTokens
    );
  });
