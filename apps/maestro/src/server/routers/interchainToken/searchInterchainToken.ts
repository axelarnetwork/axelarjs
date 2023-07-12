import { invariant } from "@axelarjs/utils";

import { TRPCError } from "@trpc/server";
import { partition } from "rambda";
import { z } from "zod";

import { EVM_CHAIN_CONFIGS, type WagmiEVMChainConfig } from "~/config/wagmi";
import { hex40Literal, hex64Literal } from "~/lib/utils/schemas";
import type { Context } from "~/server/context";
import { publicProcedure } from "~/server/trpc";
import type {
  IntercahinTokenDetails,
  RemoteInterchainTokenDetails,
} from "~/services/kv";

const tokenDetails = () => ({
  tokenId: hex64Literal().nullable(),
  tokenAddress: hex40Literal().nullable(),
  isOriginToken: z.boolean(),
  isRegistered: z.boolean(),
  chainId: z.number(),
  axelarChainId: z.string().nullable(),
  chainName: z.string(),
});

export type IntercahinTokenInfo = {
  tokenId: `0x${string}` | null;
  tokenAddress: `0x${string}` | null;
  isOriginToken: boolean;
  isRegistered: boolean;
  chainId: number;
};

export type SearchInterchainTokenOutput = IntercahinTokenInfo & {
  matchingTokens: IntercahinTokenInfo[];
};

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
  .output(
    z
      .object({
        ...tokenDetails(),
        matchingTokens: z.array(z.object(tokenDetails())),
      })
      .nullable()
  )
  .query(async ({ input, ctx }) => {
    try {
      const [[chainConfig], remainingChainConfigs] = partition(
        (chain) => chain.id === input.chainId,
        EVM_CHAIN_CONFIGS
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
        // cache for 1 hour
        ctx.res.setHeader("Cache-Control", "public, max-age=3600");

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

async function getInterchainToken(
  kvResult: IntercahinTokenDetails,
  chainConfig: WagmiEVMChainConfig,
  remainingChainConfigs: WagmiEVMChainConfig[],
  ctx: Context
) {
  const lookupToken = {
    tokenId: kvResult.tokenId,
    tokenAddress: kvResult.tokenAddress,
    isOriginToken: kvResult.originChainId === chainConfig.id,
    isRegistered: true,
    chainId: kvResult.originChainId,
    chainName: chainConfig.name,
    axelarChainId: kvResult.originAxelarChainId,
  };

  const pendingRemoteTokens = kvResult.remoteTokens.filter(
    (token) => token.status === "pending"
  );
  const hasPendingRemoteTokens = pendingRemoteTokens.length > 0;

  const registered = await Promise.all(
    kvResult.remoteTokens.map(async (remoteToken) => {
      const chainConfig = remainingChainConfigs.find(
        (x) => x.id === remoteToken.chainId
      );

      const mappedResult = {
        tokenId: kvResult.tokenId,
        tokenAddress: remoteToken.address,
        isOriginToken: false,
        isRegistered: remoteToken.status === "deployed",
        chainId: remoteToken.chainId,
        chainName: chainConfig?.name ?? "Unknown",
        axelarChainId: remoteToken.axelarChainId,
      };

      if (!hasPendingRemoteTokens || mappedResult.isRegistered) {
        // no need to check twice if the token is registered
        return mappedResult;
      }

      invariant(chainConfig, "Chain config not found");

      const tokenClient = ctx.contracts.createInterchainTokenClient(
        chainConfig,
        kvResult.tokenAddress
      );

      return {
        ...mappedResult,
        isRegistered: await tokenClient
          .read("getTokenManager")
          // attempt to read 'token.getTokenManager'
          .then(() => true)
          // which will throw if the token is not registered
          .catch(() => false),
      };
    })
  );

  const newConfirmedRemoteTokens = hasPendingRemoteTokens
    ? registered
        .filter((token) => token.isRegistered)
        .map(
          (token) =>
            kvResult.remoteTokens.find(
              (x) => x.chainId === token.chainId
            ) as RemoteInterchainTokenDetails
        )
        .filter(Boolean)
        .map((token) => ({
          ...token,
          status: "deployed" as const,
        }))
    : [];

  if (newConfirmedRemoteTokens.length > 0) {
    console.log({
      newConfirmedRemoteTokens,
      pendingRemoteTokens,
    });
    // update the KV store with the new confirmed remote tokens
    await ctx.services.kv.recordRemoteTokensDeployment(
      {
        chainId: kvResult.originChainId,
        tokenAddress: kvResult.tokenAddress,
      },
      newConfirmedRemoteTokens
    );
  } else {
    console.log("no new confirmed remote tokens");
  }

  const unregistered = remainingChainConfigs
    .filter(
      (chain) =>
        chain.id !== chainConfig.id &&
        !kvResult.remoteTokens.some((token) => token.chainId === chain.id)
    )
    .map((chain) => ({
      tokenId: null,
      tokenAddress: null,
      isOriginToken: false,
      isRegistered: false,
      chainId: chain.id,
      chainName: chain.name,
      axelarChainId: null,
    }));

  return {
    ...lookupToken,
    matchingTokens: [lookupToken, ...registered, ...unregistered],
  };
}

/**
 * Scans all chains for the given token address
 * @param chainConfigs
 * @param tokenAddress
 * @param ctx
 */
async function scanChains(
  chainConfigs: WagmiEVMChainConfig[],
  tokenAddress: `0x${string}`,
  ctx: Context
) {
  let result: Awaited<ReturnType<typeof getInterchainToken>> | null = null;

  for (const chainConfig of chainConfigs) {
    const kvEntry = await ctx.services.kv.getInterchainTokenDetails({
      chainId: chainConfig.id,
      tokenAddress: tokenAddress,
    });

    if (!kvEntry) {
      continue;
    }
    result = await getInterchainToken(kvEntry, chainConfig, chainConfigs, ctx);
  }

  return result;
}
