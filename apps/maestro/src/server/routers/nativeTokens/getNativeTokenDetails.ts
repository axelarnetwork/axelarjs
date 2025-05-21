import type { IERC20BurnableMintableClient } from "@axelarjs/evm";
import { invariant } from "@axelarjs/utils";

import { TRPCError } from "@trpc/server";
import { always } from "rambda";
import { z } from "zod";

import {
  ExtendedWagmiChainConfig,
  stellarChainConfig,
  suiChainConfig,
} from "~/config/chains";
import {
  isValidStellarTokenAddress,
  isValidSuiTokenAddress,
} from "~/lib/utils/validation";
import type { Context } from "~/server/context";
import { queryCoinMetadata } from "~/server/routers/sui/graphql";
import { publicProcedure } from "~/server/trpc";
import {
  getStellarAssetMetadata,
  getStellarChainConfig,
  getStellarContractMetadata,
} from "../stellar/utils";
import { normalizeSuiTokenAddress } from "../sui/utils/utils";

//TODO: migrate to kv store?
const overrides: Record<string, Record<string, string>> = {
  "0x4200000000000000000000000000000000000042": {
    symbol: "axlOP",
  },
};

async function getSuiTokenDetails(tokenAddress: string, chainId: number) {
  const metadata = await queryCoinMetadata(tokenAddress);
  const { name: chainName, axelarChainId, axelarChainName } = suiChainConfig;

  if (!metadata) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: `Token metadata not found for ${tokenAddress} on chain ${chainId}`,
    });
  }

  return {
    name: metadata.name,
    decimals: metadata.decimals,
    symbol: metadata.symbol,
    owner: undefined,
    pendingOwner: null,
    chainId: chainId,
    chainName,
    axelarChainId,
    axelarChainName,
  };
}

export const getStellarTokenDetails = async (
  tokenAddress: string,
  ctx: Context
) => {
  const chainConfig = await getStellarChainConfig(ctx);
  const {
    name: chainName,
    axelarChainId,
    axelarChainName,
  } = stellarChainConfig;
  let name: string;
  let symbol: string;

  if (tokenAddress.includes("-")) {
    // Classic asset: ASSET_CODE-ISSUER
    ({ name, symbol } = await getStellarAssetMetadata(tokenAddress));
  } else if (tokenAddress.startsWith("C")) {
    // Contract asset: C-CONTRACT_ADDRESS
    const rpcUrl = chainConfig.config.rpc[0];
    ({ name, symbol } = await getStellarContractMetadata(tokenAddress, rpcUrl));
  } else {
    throw new Error("Invalid Stellar asset address");
  }

  return {
    name,
    symbol,
    decimals: 7,
    chainId: chainConfig.id,
    chainName,
    axelarChainId,
    axelarChainName,
    tokenAddress,
  };
};

export const getNativeTokenDetails = publicProcedure
  .input(
    z.object({
      chainId: z.number().optional(),
      tokenAddress: z.string(),
    })
  )
  .query(async ({ input, ctx }) => {
    // Enter here if the token is a Sui token
    if (isValidSuiTokenAddress(input.tokenAddress)) {
      const normalizedTokenAddress = normalizeSuiTokenAddress(
        input.tokenAddress
      );
      return await getSuiTokenDetails(
        normalizedTokenAddress,
        input.chainId as number
      );
    }

    // Enter here if the token is a Stellar token
    if (isValidStellarTokenAddress(input.tokenAddress)) {
      return await getStellarTokenDetails(input.tokenAddress, ctx);
    }

    try {
      const { wagmiChainConfigs: chainConfigs } = ctx.configs;
      const chainConfig = chainConfigs.find(
        (chain) => chain.id === input.chainId
      );

      if (!chainConfig) {
        const promises = chainConfigs.map(async (config) => {
          const client = ctx.contracts.createERC20Client(
            config,
            input.tokenAddress
          );

          return getTokenPublicDetails(client, config, input.tokenAddress)
            .then((details) => ({
              success: true,
              details,
              config,
            }))
            .catch(() => ({
              success: false,
              config,
              details: null,
            }));
        });

        const results = await Promise.all(promises);

        const successfulResult = results.find((result) => result.success);

        if (successfulResult) {
          return successfulResult.details;
        }

        // Log errors
        results.forEach((result) => {
          if (!result.success) {
            console.error(
              `Token ${input.tokenAddress} not found on chain: ${result.config.axelarChainName}`
            );
          }
        });

        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Token not found on any chain.`,
        });
      }

      const client = ctx.contracts.createERC20Client(
        chainConfig,
        input.tokenAddress
      );

      return getTokenPublicDetails(client, chainConfig, input.tokenAddress);
    } catch (error) {
      // If we get a TRPC error, we throw it
      if (error instanceof TRPCError) {
        throw error;
      }
      // otherwise, we throw an internal server error
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Failed to get ERC20 token details for ${input.tokenAddress} on ${input.chainId}`,
        cause: error,
      });
    }
  });

async function getTokenPublicDetails(
  client: IERC20BurnableMintableClient,
  chainConfig: ExtendedWagmiChainConfig,
  tokenAddress: string
) {
  invariant(client.chain, "client.chain must be defined");

  const [name, symbol, decimals, owner, pendingOwner] = await Promise.all([
    client.reads.name(),
    client.reads.symbol(),
    client.reads.decimals(),
    client.reads.owner().catch(always(null)),
    client.reads.pendingOwner().catch(always(null)),
  ]);

  const override = overrides[tokenAddress];

  return {
    name,
    decimals,
    owner,
    pendingOwner,
    chainId: client.chain.id,
    chainName: client.chain.name,
    axelarChainId: chainConfig.axelarChainId,
    axelarChainName: chainConfig.axelarChainName,
    symbol: override?.symbol ?? symbol,
  };
}
