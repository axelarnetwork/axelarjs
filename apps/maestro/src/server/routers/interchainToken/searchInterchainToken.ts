import type { InterchainTokenClient } from "@axelarjs/evm";
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

const TOKEN_INFO_SCHEMA = z.object({
  tokenId: hex64Literal().nullable(),
  tokenAddress: hex40Literal().nullable(),
  isOriginToken: z.boolean(),
  isRegistered: z.boolean(),
  chainId: z.number(),
  axelarChainId: z.string().nullable(),
  chainName: z.string(),
  kind: z.enum(["standardized", "canonical"]).nullable(),
});

const OUTPUT_SCHEMA = TOKEN_INFO_SCHEMA.extend({
  matchingTokens: z.array(TOKEN_INFO_SCHEMA),
});

export type SearchInterchainTokenOutput = z.infer<typeof OUTPUT_SCHEMA>;

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
  .output(OUTPUT_SCHEMA.nullable())
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
    kind: kvResult.kind,
  };

  const pendingRemoteTokens = kvResult.remoteTokens.filter(
    (token) => token.status === "pending"
  );

  const hasPendingRemoteTokens = pendingRemoteTokens.length > 0;

  const verifiedRemoteTokens = await Promise.all(
    kvResult.remoteTokens.map(async (remoteToken) => {
      const chainConfig = remainingChainConfigs.find(
        (x) => x.id === remoteToken.chainId
      );

      const remoteTokenDetails = {
        tokenId: kvResult.tokenId,
        tokenAddress: remoteToken.address,
        isOriginToken: false,
        isRegistered: remoteToken.status === "deployed",
        chainId: remoteToken.chainId,
        chainName: chainConfig?.name ?? "Unknown",
        axelarChainId: remoteToken.axelarChainId,
        kind: kvResult.kind,
      };

      if (!hasPendingRemoteTokens || remoteTokenDetails.isRegistered) {
        // no need to check twice if the token is registered
        return remoteTokenDetails;
      }

      invariant(chainConfig, "Chain config not found");

      let tokenClient: InterchainTokenClient | undefined;

      switch (kvResult.kind) {
        case "standardized":
          tokenClient = ctx.contracts.createInterchainTokenClient(
            chainConfig,
            kvResult.tokenAddress
          );
          break;
        case "canonical":
          // for canonical tokens, we need to get the remote token address from the interchain token service

          const itsClient =
            ctx.contracts.createInterchainTokenServiceClient(chainConfig);

          const remoteTokenAddress = await itsClient.read("getTokenAddress", {
            args: [kvResult.tokenId],
          });

          tokenClient = ctx.contracts.createInterchainTokenClient(
            chainConfig,
            remoteTokenAddress
          );
          break;
      }

      return {
        ...remoteTokenDetails,
        // derive the token address from the interchain token contract client
        tokenAddress: tokenClient.address as `0x${string}`,
        isRegistered: await tokenClient
          .read("getTokenManager")
          // attempt to read 'token.getTokenManager'
          .then(() => true)
          // which will throw if the token is not registered
          .catch(() => false),
      };
    })
  );

  if (hasPendingRemoteTokens) {
    // if there are pending remote tokens, mark them as "deployed" if they are now registered
    const newConfirmedRemoteTokens = verifiedRemoteTokens
      .filter((token) => token.isRegistered)
      .map((t): RemoteInterchainTokenDetails | null => {
        const match = kvResult.remoteTokens.find(
          (x) => x.chainId === t.chainId
        );
        return match
          ? { ...match, address: t.tokenAddress, status: "deployed" }
          : null;
      })
      .filter(Boolean) as RemoteInterchainTokenDetails[];

    // update the KV store with the new confirmed remote tokens if any
    if (newConfirmedRemoteTokens.length) {
      await ctx.storage.kv.recordRemoteTokensDeployment(
        {
          chainId: kvResult.originChainId,
          tokenAddress: kvResult.tokenAddress,
        },
        newConfirmedRemoteTokens
      );
    }
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
      kind: null,
    }));

  return {
    ...lookupToken,
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
  chainConfigs: WagmiEVMChainConfig[],
  tokenAddress: `0x${string}`,
  ctx: Context
) {
  let result: Awaited<ReturnType<typeof getInterchainToken>> | null = null;

  for (const chainConfig of chainConfigs) {
    const kvEntry = await ctx.storage.kv.getInterchainTokenDetails({
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
