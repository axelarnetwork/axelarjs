import { TRPCError } from "@trpc/server";
import { always } from "rambda";
import { z } from "zod";

import { suiClient as client } from "~/lib/clients/suiClient";
import { publicProcedure } from "~/server/trpc";
import {
  getCoinInfoByCoinType,
  getCoinType,
  getSuiChainConfig,
} from "../sui/utils/utils";

export const ROLES_ENUM = ["MINTER", "OPERATOR", "FLOW_LIMITER"] as const;

export type TokenRole = (typeof ROLES_ENUM)[number];

export const getRoleIndex = (role: (typeof ROLES_ENUM)[number]) =>
  ROLES_ENUM.indexOf(role);

export const getInterchainTokenBalanceForOwner = publicProcedure
  .input(
    z.object({
      chainId: z.number(),
      tokenAddress: z.string(),
      owner: z.string(),
    })
  )
  .query(async ({ input, ctx }) => {
    // If the token address and owner address are not the same length, the balance is 0
    // This is because a sui address can't have evm balances and vice versa
    if (input.tokenAddress?.length !== input.owner?.length) {
      return {
        isTokenOwner: false,
        isTokenMinter: false,
        tokenBalance: "0",
        decimals: 0,
        isTokenPendingOwner: false,
        hasPendingOwner: false,
        hasMinterRole: false,
        hasOperatorRole: false,
        hasFlowLimiterRole: false,
      };
    }
    // Sui address length is 66
    if (input.tokenAddress?.length === 66) {
      const chainConfig = await getSuiChainConfig(ctx);

      const coinType = await getCoinType(input.tokenAddress);

      const { totalBalance: balance } = await client.getBalance({
        owner: input.owner,
        coinType: coinType,
      });

      // Get the coin metadata
      const metadata = await client.getCoinMetadata({ coinType });
      const InterchainTokenServiceV0 =
        chainConfig.config.contracts?.InterchainTokenService.objects
          .InterchainTokenServicev0;

      if (!InterchainTokenServiceV0) {
        throw new Error("Invalid chain config");
      }

      const coinInfo = await getCoinInfoByCoinType(
        client,
        coinType,
        InterchainTokenServiceV0
      );

      let decimals;

      // This happens when the token is deployed on sui as a remote chain
      if (!metadata) {
        decimals = coinInfo?.decimals;
      }

      const result = {
        isTokenOwner: input.owner === coinInfo?.operator,
        isTokenMinter: input.owner === coinInfo?.distributor,
        tokenBalance: balance.toString(),
        decimals: metadata?.decimals ?? decimals,
        isTokenPendingOwner: false,
        hasPendingOwner: false,
        hasMinterRole: input.owner === coinInfo?.distributor,
        hasOperatorRole: input.owner === coinInfo?.operator,
        hasFlowLimiterRole: false, // TODO: check if this is correct
      };
      return result;
    }
    // This is for ERC20 tokens
    const balanceOwner = input.owner as `0x${string}`;
    const tokenAddress = input.tokenAddress as `0x${string}`;

    const chainConfig = ctx.configs.wagmiChainConfigs.find(
      (chain) => chain.id === input.chainId
    );

    if (!chainConfig) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: `Invalid chainId: ${input.chainId}`,
      });
    }

    try {
      const client = ctx.contracts.createERC20Client(
        chainConfig,
        input.tokenAddress
      );

      const [tokenBalance, decimals, owner, pendingOwner] = await Promise.all([
        client.reads.balanceOf({ account: balanceOwner }),
        client.reads.decimals(),
        client.reads.owner().catch(always(null)),
        client.reads.pendingOwner().catch(always(null)),
      ]);

      const itClient = ctx.contracts.createInterchainTokenClient(
        chainConfig,
        tokenAddress
      );

      const [
        isTokenMinter,
        hasMinterRole,
        hasOperatorRole,
        hasFlowLimiterRole,
      ] = await Promise.all(
        [
          itClient.reads.isMinter({
            addr: balanceOwner,
          }),
          itClient.reads.hasRole({
            role: getRoleIndex("MINTER"),
            account: balanceOwner,
          }),
          itClient.reads.hasRole({
            role: getRoleIndex("OPERATOR"),
            account: balanceOwner,
          }),
          itClient.reads.hasRole({
            role: getRoleIndex("FLOW_LIMITER"),
            account: balanceOwner,
          }),
        ].map((p) => p.catch(always(false)))
      );

      const isTokenOwner = owner === balanceOwner;

      return {
        isTokenOwner,
        isTokenMinter,
        tokenBalance: tokenBalance.toString(),
        decimals,
        isTokenPendingOwner: pendingOwner === balanceOwner,
        hasPendingOwner: pendingOwner !== null,
        hasMinterRole,
        hasOperatorRole,
        hasFlowLimiterRole,
      };
    } catch (error) {
      // If we get a TRPC error, we throw it
      if (error instanceof TRPCError) {
        throw error;
      }
      // otherwise, we throw an internal server error
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Failed to get ERC20 token balance on ${input.tokenAddress} on chain ${input.chainId} for ${input.owner}`,
        cause: error,
      });
    }
  });
