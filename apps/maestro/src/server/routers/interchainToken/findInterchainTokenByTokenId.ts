import { Maybe } from "@axelarjs/utils";

import { z } from "zod";

import { getTokenManagerTypeFromBigInt } from "~/lib/drizzle/schema/common";
import { hex64Literal } from "~/lib/utils/validation";
import { Context } from "~/server/context";
import { publicProcedure } from "~/server/trpc";

/**
 * Scans all chains for the given token id and returns the results
 *
 * @param tokenId
 * @param ctx
 * @returns a list of results
 */
export async function scanInterchainTokenOnChainByTokenId(
  tokenId: `0x${string}`,
  ctx: Context
) {
  const results = await Promise.all(
    ctx.configs.wagmiChainConfigs.map(async (config) => {
      const serviceClient =
        ctx.contracts.createInterchainTokenServiceClient(config);

      const [tokenAddress, tokenManagerAddress] = (await Promise.all([
        serviceClient.reads
          .interchainTokenAddress({
            tokenId,
          })
          .catch(() => null),
        serviceClient.reads
          .tokenManagerAddress({
            tokenId,
          })
          .catch(() => null),
      ])) as [`0x${string}` | null, `0x${string}` | null];

      if (!tokenAddress || !tokenManagerAddress) {
        return {
          status: "error" as const,
          statusMessage: "token not found",
          // metadata
          tokenId,
          axelarChainId: config.axelarChainId,
          tokenManagerAddress,
          tokenAddress,
        };
      }

      const tokenManagerClient = ctx.contracts.createTokenManagerClient(
        config,
        tokenManagerAddress
      );

      const [tokenManagerTypeCode, originTokenAddress] = (await Promise.all([
        tokenManagerClient.reads.implementationType().catch(() => null),
        tokenManagerClient.reads.tokenAddress().catch(() => null),
      ])) as [bigint | null, `0x${string}` | null];

      const tokenManagerType = Maybe.of(
        tokenManagerTypeCode as bigint
      ).mapOrNull(getTokenManagerTypeFromBigInt);

      const erc20Client = ctx.contracts.createERC20Client(
        config,
        (originTokenAddress as `0x${string}`) ?? tokenAddress
      );

      const [tokenName, tokenSymbol, tokenDecimals] = await Promise.all([
        erc20Client.reads.name().catch(() => null),
        erc20Client.reads.symbol().catch(() => null),
        erc20Client.reads.decimals().catch(() => null),
      ]);

      const definitiveTokenAddress = originTokenAddress ?? tokenAddress;

      if (!tokenName || !tokenSymbol || !tokenDecimals) {
        return {
          status: "error" as const,
          statusMessage: "not a valid erc20 token",
          // metadata
          tokenName,
          tokenSymbol,
          tokenDecimals,
          tokenId,
          tokenAddress: definitiveTokenAddress,
          axelarChainId: config.axelarChainId,
          tokenManagerAddress,
          tokenManagerType,
        };
      }

      if (!tokenManagerType) {
        return {
          status: "error" as const,
          statusMessage: "token manager type not found",
          // metadata
          tokenName,
          tokenSymbol,
          tokenDecimals,
          tokenId,
          tokenAddress: definitiveTokenAddress,
          axelarChainId: config.axelarChainId,
          tokenManagerAddress,
        };
      }

      return {
        status: "success" as const,
        statusMessage: "token found",
        // metadata
        tokenName,
        tokenSymbol,
        tokenDecimals,
        tokenId,
        tokenAddress: definitiveTokenAddress,
        axelarChainId: config.axelarChainId,
        tokenManagerAddress,
        tokenManagerType,
      };
    })
  );

  return results;
}

export const findInterchainTokenByTokenId = publicProcedure
  .input(
    z.object({
      tokenId: hex64Literal(),
    })
  )
  .query(async ({ ctx, input }) =>
    scanInterchainTokenOnChainByTokenId(input.tokenId, ctx)
  );

export type FindInterchainTokenByTokenIdOutput =
  typeof findInterchainTokenByTokenId._def._output_out;
