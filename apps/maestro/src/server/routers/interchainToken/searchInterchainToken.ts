import { invariant } from "@axelarjs/utils";

import { Asset } from "@stellar/stellar-sdk";
import { TRPCError } from "@trpc/server";
import { partition, pluck, propEq } from "rambda";
import { Client } from "stellar-sdk/contract";
import { z } from "zod";

import type { ExtendedWagmiChainConfig } from "~/config/chains";
import { suiClient } from "~/lib/clients/suiClient";
import { InterchainToken, RemoteInterchainToken } from "~/lib/drizzle/schema";
import { TOKEN_MANAGER_TYPES } from "~/lib/drizzle/schema/common";
import { hexLiteral } from "~/lib/utils/validation";
import type { Context } from "~/server/context";
import { publicProcedure } from "~/server/trpc";
import { formatTokenId, getStellarChainConfig } from "../stellar/utils";
import { STELLAR_NETWORK_PASSPHRASE } from "../stellar/utils/config";
import { checkIfTokenContractExists } from "../stellar/utils/transactions";
import {
  getCoinAddressFromType,
  getSuiEventsByTxHash,
} from "../sui/utils/utils";

interface StellarITSContractClient {
  interchain_token_address: (params: {
    token_id: Buffer;
  }) => Promise<{ result: string }>;
  registered_token_address: (params: {
    token_id: Buffer;
  }) => Promise<{ result: string }>;
  token_manager_address: (params: {
    token_id: Buffer;
  }) => Promise<{ result: string | null }>;
}

const tokenDetailsSchema = z.object({
  chainId: z.number(),
  chainName: z.string(),
  axelarChainId: z.string(),
  // nullable fields
  tokenId: hexLiteral().nullable(),
  tokenAddress: z.string().nullable(),
  tokenManagerAddress: z.string().optional().nullable(),
  tokenManagerType: z.enum(TOKEN_MANAGER_TYPES).nullable(),
  isOriginToken: z.boolean().nullable(),
  isRegistered: z.boolean(),
  kind: z.enum(["interchain", "canonical", "custom"]),
});

export const inputSchema = z.object({
  chainId: z.number().optional(),
  tokenAddress: z.string(),
  strict: z.boolean().optional(),
});

export type SearchInterchainTokenInput = z.infer<typeof inputSchema>;

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
  .input(inputSchema)
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
  const originChainConfig =
    tokenDetails.axelarChainId === chainConfig.axelarChainId
      ? chainConfig
      : remainingChainConfigs.find(
          propEq(tokenDetails.axelarChainId, "axelarChainId")
        );

  if (!originChainConfig) {
    return null;
  }

  const lookupToken = {
    tokenId: tokenDetails.tokenId,
    tokenAddress: tokenDetails.tokenAddress,
    tokenManagerAddress: tokenDetails.tokenManagerAddress,
    tokenManagerType: tokenDetails.tokenManagerType,
    isOriginToken: true,
    isRegistered: true,
    chainId: originChainConfig.id,
    chainName: originChainConfig.name,
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
          tokenManagerAddress: remoteToken.tokenManagerAddress,
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

        // TODO: handle if the chain does not support evm query
        if (chainConfig?.supportWagmi) {
          const itsClient =
            ctx.contracts.createInterchainTokenServiceClient(chainConfig);

          let tokenAddress = tokenDetails.tokenAddress as `0x${string}`;

          if (tokenDetails.kind === "canonical") {
            const remoteTokenAddress = (await itsClient.reads
              .registeredTokenAddress({
                tokenId: tokenDetails.tokenId as `0x${string}`,
              })
              .catch(() => null)) as `0x${string}`;

            if (remoteTokenAddress) {
              tokenAddress = remoteTokenAddress;
            }
          }

          const isRegistered = await itsClient.reads
            .registeredTokenAddress({
              tokenId: tokenDetails.tokenId as `0x${string}`,
            })
            .then(() => true)
            .catch(() => {
              return false;
            });

          return {
            ...remoteTokenDetails,
            // derive the token address from the interchain token contract client
            tokenAddress,
            isRegistered,
          };
        } else if (chainConfig?.axelarChainId.includes("sui")) {
          const suiTxHash = await findSuiTxHashFromGmp(
            ctx,
            remoteToken.deploymentMessageId
          );

          if (!suiTxHash) {
            return {
              ...remoteTokenDetails,
              isRegistered: false,
            };
          }

          const { isRegistered, tokenAddress } =
            await getSuiTokenRegistrationDetails(suiTxHash, remoteTokenDetails);

          return {
            ...remoteTokenDetails,
            tokenAddress,
            isRegistered,
          };
        } else if (chainConfig?.axelarChainId.includes("stellar")) {
          // Get the token ID from the token details
          const tokenId = remoteTokenDetails.tokenId || tokenDetails.tokenId;

          if (!tokenId) {
            return {
              ...remoteTokenDetails,
              isRegistered: false,
            };
          }

          // Check if the token is registered on Stellar by directly querying the contract
          const { isRegistered, tokenAddress, tokenManagerAddress } =
            await getStellarTokenRegistrationDetails(tokenId, ctx);

          return {
            ...remoteTokenDetails,
            tokenAddress,
            tokenManagerAddress,
            isRegistered,
          };
        } else {
          return remoteTokenDetails;
        }
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
              tokenManagerAddress: registeredToken.tokenManagerAddress ?? "0x",
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
  tokenAddress: string,
  ctx: Context
) {
  const promises = chainConfigs.map(async (chainConfig) => {
    return getTokenDetails(chainConfig, tokenAddress, ctx)
      .then((tokenDetails) => {
        if (tokenDetails) {
          // Ensure the token has remoteTokens property before passing to getInterchainToken
          // Use type assertion to handle the remoteTokens property
          const tokenWithRemoteTokens: TokenDetails = {
            ...tokenDetails,
            remoteTokens: (tokenDetails as any).remoteTokens || [],
          };

          const result = getInterchainToken(
            tokenWithRemoteTokens,
            chainConfig,
            chainConfigs,
            ctx
          );
          if (result) {
            return result;
          }
          return null;
        }
      })
      .catch(() => {
        console.log(
          `Token not found for chain: ${chainConfig.axelarChainName}`
        );
        return null;
      });
  });
  const results = await Promise.all(promises);
  const validResult = results.find((result) => result);

  return validResult || null;
}

/**
 * Finds the Sui transaction hash from the GMP response.
 * @param ctx
 * @param deploymentMessageId
 * @returns
 */
async function findSuiTxHashFromGmp(ctx: Context, deploymentMessageId: string) {
  const initialTxHash = deploymentMessageId.split("-")[0];
  const firstHopCalls = await ctx.services.gmp.searchGMP({
    txHash: initialTxHash,
    _source: {
      includes: ["callback"],
    },
  });

  const suiBoundCalls = firstHopCalls.filter((call) =>
    call.callback?.returnValues?.destinationChain?.includes("sui")
  );

  const axelarTxHash = suiBoundCalls[0]?.callback?.transaction?.hash;

  if (!axelarTxHash) {
    return undefined;
  }

  const secondHopCalls = await ctx.services.gmp.searchGMP({
    txHash: axelarTxHash,
    _source: {
      includes: ["executed"],
    },
  });

  const suiExecutedCalls = secondHopCalls.filter((call) =>
    call.executed?.chain?.includes("sui")
  );

  return suiExecutedCalls[0]?.executed?.transaction?.hash;
}

/**
 * Gets the Sui token registration details from the Sui transaction hash.
 */
async function getSuiTokenRegistrationDetails(
  suiTxHash: string,
  remoteTokenDetails: { tokenAddress: string | null }
) {
  const eventDetails = await getSuiEventsByTxHash(suiClient, suiTxHash);

  const registeredEvent = eventDetails?.data.find((event) =>
    event.type.includes("CoinRegistered")
  );

  const tokenAddress = registeredEvent
    ? getCoinAddressFromType(registeredEvent.type, "CoinRegistered")
    : remoteTokenDetails.tokenAddress;

  return {
    isRegistered: Boolean(registeredEvent),
    tokenAddress,
  };
}

async function getTokenDetails(
  chainConfig: ExtendedWagmiChainConfig,
  tokenAddress: string,
  ctx: Context
) {
  // First, try with the original token address
  let tokenDetails =
    await ctx.persistence.postgres.getInterchainTokenByChainIdAndTokenAddress(
      chainConfig.axelarChainId,
      tokenAddress
    );

  if (tokenDetails) {
    // Ensure the token has remoteTokens property
    if (!tokenDetails.remoteTokens && tokenDetails.tokenId) {
      const fullToken =
        await ctx.persistence.postgres.getInterchainTokenByTokenId(
          tokenDetails.tokenId
        );
      if (fullToken) {
        return fullToken;
      } else {
        return {
          ...tokenDetails,
          remoteTokens: [],
        } as TokenDetails;
      }
    }
    return tokenDetails;
  }

  // Check for remote token with original address
  let remoteTokenDetails =
    await ctx.persistence.postgres.getRemoteInterchainTokenByChainIdAndTokenAddress(
      chainConfig.axelarChainId,
      tokenAddress
    );

  if (remoteTokenDetails) {
    const token = await ctx.persistence.postgres.getInterchainTokenByTokenId(
      remoteTokenDetails.tokenId
    );
    // Make sure it has remoteTokens property
    if (token && !token.remoteTokens) {
      return {
        ...token,
        remoteTokens: [],
      } as TokenDetails;
    }
    return token;
  }

  // If not found and this is a Stellar chain, try the alternative format
  if (chainConfig.axelarChainName.includes("stellar")) {
    try {
      let alternativeAddress = null;

      // If original is symbol-issuer format (not starting with 'C'), convert to contract format
      if (!tokenAddress.startsWith("C")) {
        // Check for both ':' and '-' separators
        const separator = tokenAddress.includes(":")
          ? ":"
          : tokenAddress.includes("-")
            ? "-"
            : null;

        if (separator) {
          const [assetCode, issuer] = tokenAddress.split(separator);
          const stellarAsset = new Asset(assetCode, issuer);
          alternativeAddress = stellarAsset.contractId(
            STELLAR_NETWORK_PASSPHRASE
          );
        }
      }

      if (alternativeAddress) {
        // Check for interchain token with alternative address
        tokenDetails =
          await ctx.persistence.postgres.getInterchainTokenByChainIdAndTokenAddress(
            chainConfig.axelarChainId,
            alternativeAddress
          );

        if (tokenDetails) {
          // Ensure the token has remoteTokens property
          if (!tokenDetails.remoteTokens && tokenDetails.tokenId) {
            const fullToken =
              await ctx.persistence.postgres.getInterchainTokenByTokenId(
                tokenDetails.tokenId
              );
            if (fullToken) {
              return fullToken;
            } else {
              return {
                ...tokenDetails,
                remoteTokens: [],
              } as TokenDetails;
            }
          }
          return tokenDetails;
        }

        // Check for remote token with alternative address
        remoteTokenDetails =
          await ctx.persistence.postgres.getRemoteInterchainTokenByChainIdAndTokenAddress(
            chainConfig.axelarChainId,
            alternativeAddress
          );

        if (remoteTokenDetails) {
          const token =
            await ctx.persistence.postgres.getInterchainTokenByTokenId(
              remoteTokenDetails.tokenId
            );
          // Make sure it has remoteTokens property
          if (token && !token.remoteTokens) {
            return {
              ...token,
              remoteTokens: [],
            } as TokenDetails;
          }
          return token;
        }
      }
    } catch (error) {
      console.error(
        `[getTokenDetails] Error converting address format:`,
        error
      );
    }
  }

  return null;
}

export async function getStellarTokenRegistrationDetails(
  tokenId: string,
  ctx: Context
): Promise<{
  isRegistered: boolean;
  tokenAddress: string | null;
  tokenManagerAddress: string | null;
}> {
  try {
    const chainConfig = await getStellarChainConfig(ctx);
    const rpcUrl = chainConfig.config.rpc[0];

    // Create a network-configured Stellar contract client
    const ITSStellarContractClient = (await Client.from({
      contractId: chainConfig.config.contracts.InterchainTokenService.address,
      networkPassphrase: STELLAR_NETWORK_PASSPHRASE,
      rpcUrl,
    })) as unknown as StellarITSContractClient;

    // Format the token ID properly (32 bytes)
    const tokenIdBuffer = formatTokenId(tokenId);

    const tokenAddressResult =
      await ITSStellarContractClient.registered_token_address({
        token_id: tokenIdBuffer,
      });
    const tokenAddress = tokenAddressResult.result;

    const tokenManagerResult =
      await ITSStellarContractClient.token_manager_address({
        token_id: tokenIdBuffer,
      });
    const tokenManagerAddress = tokenManagerResult.result;

    const tokenContractExists = await checkIfTokenContractExists(tokenAddress);

    const isRegistered = Boolean(
      tokenAddress && tokenManagerAddress && tokenContractExists
    );

    return {
      isRegistered,
      tokenAddress: tokenAddress,
      tokenManagerAddress: tokenManagerAddress || null,
    };
  } catch (error) {
    console.error("Error checking Stellar token registration:", error);
    return {
      isRegistered: false,
      tokenAddress: null,
      tokenManagerAddress: null,
    };
  }
}
