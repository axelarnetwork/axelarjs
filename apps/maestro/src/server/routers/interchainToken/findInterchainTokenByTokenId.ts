import { Maybe } from "@axelarjs/utils";

import { z } from "zod";

import { getTokenManagerTypeFromBigInt } from "~/lib/drizzle/schema/common";
import { hex64Literal } from "~/lib/utils/validation";
import { Context } from "~/server/context";
import { publicProcedure } from "~/server/trpc";

export async function scrapeInterchainToken(
  tokenId: `0x${string}`,
  ctx: Context
) {
  const results = await Promise.all(
    ctx.configs.wagmiChainConfigs.map(async (config) => {
      const serviceClient =
        ctx.contracts.createInterchainTokenServiceClient(config);

      const [tokenAddress, tokenManagerAddress] = await Promise.all([
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
      ]);

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

      const [tokenManagerTypeCode, originTokenAddress] = await Promise.all([
        tokenManagerClient.reads.implementationType().catch(() => null),
        tokenManagerClient.reads.tokenAddress().catch(() => null),
      ]);

      const tokenManagerType = Maybe.of(tokenManagerTypeCode).mapOrNull(
        getTokenManagerTypeFromBigInt
      );

      const erc20Client = ctx.contracts.createERC20Client(
        config,
        originTokenAddress ?? tokenAddress
      );

      const [name, symbol, decimals] = await Promise.all([
        erc20Client.reads.name().catch(() => null),
        erc20Client.reads.symbol().catch(() => null),
        erc20Client.reads.decimals().catch(() => null),
      ]);

      if (!tokenManagerType) {
        return {
          status: "error" as const,
          statusMessage: "token manager type not found",
          // metadata
          name,
          symbol,
          decimals,
          tokenId,
          tokenAddress: originTokenAddress ?? tokenAddress,
          axelarChainId: config.axelarChainId,
          tokenManagerAddress,
        };
      }

      return {
        status: "success" as const,
        statusMessage: "token found",
        // metadata
        name,
        symbol,
        decimals,
        tokenId,
        tokenAddress: originTokenAddress ?? tokenAddress,
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
  .query(async ({ ctx, input }) => {
    // first check if the token exists in the database
    const existingToken =
      await ctx.persistence.postgres.getInterchainTokenByTokenId(input.tokenId);

    if (!existingToken) {
      // we need to scrape the token from the chains
      return await scrapeInterchainToken(input.tokenId, ctx);
    }

    return [
      {
        status: "success" as const,
        statusMessage: "token found in database",
        // metadata
        name: existingToken.tokenName,
        symbol: existingToken.tokenSymbol,
        decimals: existingToken.tokenDecimals,
        tokenId: existingToken.tokenId,
        tokenAddress: existingToken.tokenAddress,
        axelarChainId: existingToken.axelarChainId,
        tokenManagerAddress: existingToken.tokenManagerAddress,
        tokenManagerType: existingToken.tokenManagerType,
        deployerAddress: existingToken.deployerAddress,
      },
    ];
  });

export type FindInterchainTokenByTokenIdOutput =
  typeof findInterchainTokenByTokenId._def._output_out;
