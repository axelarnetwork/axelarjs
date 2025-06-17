import { Asset } from "@stellar/stellar-sdk";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { stellarChainConfig, suiChainConfig } from "~/config/chains";
import { TOKEN_MANAGER_TYPES } from "~/lib/drizzle/schema/common";
import { STELLAR_CHAIN_ID, SUI_CHAIN_ID } from "~/lib/hooks";
import { hex0xLiteral, hex64Literal } from "~/lib/utils/validation";
import { publicProcedure } from "~/server/trpc";
import { STELLAR_NETWORK_PASSPHRASE } from "../stellar/utils/config";

const remoteTokenSchema = z.object({
  id: z.string(),
  tokenId: z.string(),
  axelarChainId: z.string(),
  tokenAddress: z.string(),
  tokenManagerAddress: z.string().nullable(),
  tokenManagerType: z.enum(TOKEN_MANAGER_TYPES).nullable(),
  deploymentMessageId: z.string(),
  deploymentStatus: z.string().nullable(),
  createdAt: z.date().nullable(),
  updatedAt: z.date().nullable(),
});

export const inputSchema = z.object({
  chainId: z.number(),
  tokenAddress: z.string(),
});

const outputSchema = z.object({
  tokenId: z.string(),
  tokenAddress: z.string(),
  axelarChainId: z.string(),
  tokenName: z.string(),
  tokenSymbol: z.string(),
  tokenDecimals: z.number(),
  deploymentMessageId: z.string(),
  deployerAddress: z.string(),
  tokenManagerAddress: z.string().nullable(),
  tokenManagerType: z.enum(TOKEN_MANAGER_TYPES).nullable(),
  originalMinterAddress: z.string().nullable(),
  kind: z.string(),
  createdAt: z.date().nullable(),
  updatedAt: z.date().nullable(),
  salt: hex64Literal().or(hex0xLiteral()),
  remoteTokens: z.array(remoteTokenSchema),
});

export const getInterchainTokenDetails = publicProcedure
  .meta({
    openapi: {
      summary: "Get token details for an interchain token",
      description:
        "Get the details for an interchain token by address and chain ID",
      method: "GET",
      path: "/interchain-token/details",
      tags: ["interchain-token"],
    },
  })
  .output(outputSchema)
  .input(inputSchema)
  .query(async ({ input, ctx }) => {
    // Get both EVM and VM chains
    const [evmChains, vmChains] = await Promise.all([
      ctx.configs.evmChains(),
      ctx.configs.vmChains(),
    ]);

    // Combine chains and look for config
    const configs = evmChains[input.chainId] || vmChains[input.chainId];

    // TODO: remove this once we have sui in the chains object
    const axelarChainId =
      input.chainId === SUI_CHAIN_ID
        ? suiChainConfig.axelarChainId
        : input.chainId === STELLAR_CHAIN_ID
          ? stellarChainConfig.axelarChainId
          : configs.info.id;
    // if (!configs) {
    //   throw new TRPCError({
    //     code: "NOT_FOUND",
    //     message: `Chain configuration not found for chain ID ${input.chainId}`,
    //   });
    // }

    // For Stellar tokens, we need to handle both symbol-issuer and contract address formats
    let tokenRecord = null;

    tokenRecord =
      await ctx.persistence.postgres.getInterchainTokenByChainIdAndTokenAddress(
        axelarChainId,
        input.tokenAddress
      );

    // If not found and this is a Stellar chain, try the alternative Contract format
    if (!tokenRecord && input.chainId === STELLAR_CHAIN_ID) {
      console.log(
        `[getInterchainTokenDetails] Token not found with original address, trying alternative format`
      );

      try {
        let alternativeAddress = null;

        // If original is symbol-issuer format (not starting with 'C'), convert to contract format
        if (!input.tokenAddress.startsWith("C")) {
          // Check for both ':' and '-' separators
          const separator = input.tokenAddress.includes(":")
            ? ":"
            : input.tokenAddress.includes("-")
              ? "-"
              : null;

          if (separator) {
            const [assetCode, issuer] = input.tokenAddress.split(separator);
            const stellarAsset = new Asset(assetCode, issuer);
            alternativeAddress = stellarAsset.contractId(
              STELLAR_NETWORK_PASSPHRASE
            );
            console.log(
              `[getInterchainTokenDetails] Converted to contract format: ${input.tokenAddress} → ${alternativeAddress}`
            );
          }
        }

        if (alternativeAddress) {
          tokenRecord =
            await ctx.persistence.postgres.getInterchainTokenByChainIdAndTokenAddress(
              axelarChainId,
              alternativeAddress
            );

          if (tokenRecord) {
            console.log(
              `[getInterchainTokenDetails] Found token with alternative address`
            );
          }
        }
      } catch (error) {
        console.error(
          `[getInterchainTokenDetails] Error converting address format:`,
          error
        );
      }
    }

    // If we found a token but it doesn't have remoteTokens, get the full record
    if (tokenRecord && !tokenRecord.remoteTokens && tokenRecord.tokenId) {
      const fullTokenRecord =
        await ctx.persistence.postgres.getInterchainTokenByTokenId(
          tokenRecord.tokenId
        );

      if (fullTokenRecord) {
        tokenRecord = fullTokenRecord;
      } else {
        tokenRecord = {
          ...tokenRecord,
          remoteTokens: [],
        };
      }
    }

    if (!tokenRecord) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Interchain token ${input.tokenAddress} not found on chain ${input.chainId}`,
      });
    }

    return tokenRecord;
  });
