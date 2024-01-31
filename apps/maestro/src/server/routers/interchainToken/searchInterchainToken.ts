import { type InterchainTokenClient } from "@axelarjs/evm";
import { invariant } from "@axelarjs/utils";

import { TRPCError } from "@trpc/server";
import { partition, pluck } from "rambda";
import { z } from "zod";

import type { ExtendedWagmiChainConfig } from "~/config/wagmi";
import { InterchainToken, RemoteInterchainToken } from "~/lib/drizzle/schema";
import { hex40Literal, hexLiteral } from "~/lib/utils/validation";
import type { Context } from "~/server/context";
import { publicProcedure } from "~/server/trpc";

const tokenDetailsSchema = z.object({
  chainId: z.number(),
  chainName: z.string(),
  axelarChainId: z.string(),
  // nullable fields
  tokenId: hexLiteral().nullable(),
  tokenAddress: hex40Literal().nullable(),
  tokenManagerAddress: hex40Literal().optional().nullable(),
  tokenManagerType: z.string().nullable(),
  isOriginToken: z.boolean().nullable(),
  isRegistered: z.boolean(),
  kind: z.enum(["interchain", "canonical", "custom"]),
});

const outputSchema = tokenDetailsSchema.extend({
  wasDeployedByAccount: z.boolean(),
  matchingTokens: z.array(tokenDetailsSchema),
});

export const searchInterchainToken = publicProcedure
  .meta({
    openapi: {
      summary: "Search for an interchain token",
      description:
        "Search for an interchain token by address, either on a specific chain or on any chain",
      method: "GET",
      path: "/interchain-token/search",
      tags: ["interchain-token"],
    },
  })
  .input(
    z.object({
      chainId: z.number().optional(),
      tokenAddress: hex40Literal(),
      strict: z.boolean().optional(),
    })
  )
  .output(outputSchema)
  .query(async ({ input, ctx }) => {
    try {
      const [[chainConfig], remainingChainConfigs] = partition(
        (chain) => chain.id === input.chainId,
        ctx.configs.wagmiChainConfigs
      );

      const scanPromise = !chainConfig
        ? // scan all chains
          scanChains(remainingChainConfigs, input.tokenAddress, ctx)
        : // scan the specified chain
          scanChains(
            input.strict
              ? // only scan the specified chain if in strict mode
                [chainConfig]
              : // scan all chains, starting with the specified chain
                [chainConfig, ...remainingChainConfigs],
            input.tokenAddress,
            ctx
          );

      const result = await scanPromise;

      if (result) {
        return result;
      }

      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Token ${input.tokenAddress} not registered on any chain`,
      });
    } catch (error) {
      // If we get a TRPC error, we throw it
      if (error instanceof TRPCError) {
        throw error;
      }
      // otherwise, we throw an internal server error
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to get InterchainToken details",
        cause: error,
      });
    }
  });

interface TokenDetails extends InterchainToken {
  remoteTokens: RemoteInterchainToken[];
}

async function getInterchainToken(
  tokenDetails: TokenDetails,
  chainConfig: ExtendedWagmiChainConfig,
  remainingChainConfigs: ExtendedWagmiChainConfig[],
  ctx: Context
) {
  const lookupToken = {
    tokenId: tokenDetails.tokenId,
    tokenAddress: tokenDetails.tokenAddress,
    tokenManagerAddress: tokenDetails.tokenManagerAddress,
    tokenManagerType: tokenDetails.tokenManagerType,
    isOriginToken: tokenDetails.axelarChainId === chainConfig?.axelarChainId,
    isRegistered: true,
    chainId: chainConfig.id,
    chainName: chainConfig.name,
    axelarChainId: tokenDetails.axelarChainId,
    kind: tokenDetails.kind,
  };

  const pendingRemoteTokens = tokenDetails.remoteTokens.filter(
    (token) => token.deploymentStatus === "pending"
  );

  const hasPendingRemoteTokens = pendingRemoteTokens.length > 0;

  const verifiedRemoteTokens = await Promise.all(
    tokenDetails.remoteTokens
      .map(
        (remoteToken) =>
          [
            remoteToken,
            remainingChainConfigs.find(
              ({ axelarChainId }) => axelarChainId === remoteToken.axelarChainId
            ),
          ] as const
      )
      .filter(([, chain]) => chain)
      .map(async ([remoteToken, chainConfig]) => {
        invariant(chainConfig, "Chain config not found");

        const remoteTokenDetails = {
          tokenId: tokenDetails.tokenId,
          tokenAddress: remoteToken.tokenAddress,
          tokeManagerAddress: remoteToken.tokenManagerAddress,
          tokenManagerType: remoteToken.tokenManagerType,
          isOriginToken: false,
          isRegistered: remoteToken.deploymentStatus === "confirmed",
          chainId: chainConfig.id,
          chainName: chainConfig.name,
          axelarChainId: remoteToken.axelarChainId,
          kind: tokenDetails.kind,
        };

        if (!hasPendingRemoteTokens || remoteTokenDetails.isRegistered) {
          // no need to check twice if the token is registered
          return remoteTokenDetails;
        }

        invariant(chainConfig, "Chain config not found");

        let tokenClient: InterchainTokenClient | undefined;

        const itsClient =
          ctx.contracts.createInterchainTokenServiceClient(chainConfig);

        switch (tokenDetails.kind) {
          case "interchain":
            tokenClient = ctx.contracts.createInterchainTokenClient(
              chainConfig,
              tokenDetails.tokenAddress as `0x${string}`
            );
            break;
          case "canonical":
            {
              const remoteTokenAddress = await itsClient.reads
                .interchainTokenAddress({
                  tokenId: tokenDetails.tokenId as `0x${string}`,
                })
                .catch(() => null);

              if (remoteTokenAddress) {
                tokenClient = ctx.contracts.createInterchainTokenClient(
                  chainConfig,
                  remoteTokenAddress
                );
              }
            }
            break;
        }

        // TODO: use InterchainTokenService.validTokenManagerAddress to check if the token is registered
        // alternatively, we can use InterchainTokenService.validTokenAddress to check if the token is registered

        const isRegistered = !tokenClient
          ? false
          : await tokenClient.reads
              .symbol()
              // attempt to read 'token.interchainTokenService' which will throw if the token is not registered
              .then((symbol) => symbol === tokenDetails.tokenSymbol)
              // which will throw if the token is not registered
              .catch(() => false);

        return {
          ...remoteTokenDetails,
          // derive the token address from the interchain token contract client
          tokenAddress: tokenClient?.address ?? null,
          isRegistered,
        };
      })
  );

  if (hasPendingRemoteTokens) {
    // if there are pending remote tokens, mark them as "deployed" if they are now registered
    const newConfirmedRemoteTokens = verifiedRemoteTokens
      .filter((token) => token.isRegistered)
      .map((registeredToken) => {
        const match = tokenDetails.remoteTokens.find(
          (token) => token.axelarChainId === registeredToken.axelarChainId
        );
        return match
          ? {
              ...match,
              tokenAddress: registeredToken.tokenAddress ?? "0x",
              tokenManagerAddress: registeredToken.tokeManagerAddress ?? "0x",
              tokenManagerType: registeredToken.tokenManagerType,
              deploymentStatus: "confirmed",
            }
          : null;
      })
      .filter(Boolean) as RemoteInterchainToken[];

    // update the KV store with the new confirmed remote tokens if any
    if (newConfirmedRemoteTokens.length) {
      const axelarChainIds = pluck("axelarChainId", newConfirmedRemoteTokens);

      await ctx.persistence.postgres.updateRemoteInterchainTokenDeploymentsStatus(
        tokenDetails.tokenId as `0x${string}`,
        "confirmed",
        axelarChainIds
      );
    }
  }

  const unregistered = remainingChainConfigs
    .filter(
      (chain) =>
        chain.id !== chainConfig.id &&
        !tokenDetails.remoteTokens.some(
          (token) => token.axelarChainId === chain.axelarChainId
        )
    )
    .map((chain) => ({
      chainId: chain.id,
      axelarChainId: chain.axelarChainId,
      chainName: chain.name,
      tokenId: null,
      tokenAddress: null,
      tokenManagerAddress: null,
      tokenManagerType: null,
      isOriginToken: false,
      isRegistered: false,
      wasDeployedByAccount: false,
      kind: lookupToken.kind,
    }));

  return {
    ...lookupToken,
    wasDeployedByAccount: tokenDetails.deployerAddress === ctx.session?.address,
    matchingTokens: [lookupToken, ...verifiedRemoteTokens, ...unregistered],
  };
}

/**
 * Scans all chains for the given token address
 * @param chainConfigs
 * @param tokenAddress
 * @param ctx
 */
async function scanChains(
  chainConfigs: ExtendedWagmiChainConfig[],
  tokenAddress: `0x${string}`,
  ctx: Context
) {
  for (const chainConfig of chainConfigs) {
    const tokenDetails =
      await ctx.persistence.postgres.getInterchainTokenByChainIdAndTokenAddress(
        chainConfig.axelarChainId,
        tokenAddress
      );

    if (tokenDetails) {
      return await getInterchainToken(
        tokenDetails,
        chainConfig,
        chainConfigs,
        ctx
      );
    }
  }

  return null;
}
