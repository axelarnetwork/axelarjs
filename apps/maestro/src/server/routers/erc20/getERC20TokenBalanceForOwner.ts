import { getFullnodeUrl } from "@mysten/sui.js/client";
import { SuiClient } from "@mysten/sui/client";
import { TRPCError } from "@trpc/server";
import { always } from "rambda";
import { z } from "zod";

import { publicProcedure } from "~/server/trpc";

export const ROLES_ENUM = ["MINTER", "OPERATOR", "FLOW_LIMITER"] as const;

export type TokenRole = (typeof ROLES_ENUM)[number];

export const getRoleIndex = (role: (typeof ROLES_ENUM)[number]) =>
  ROLES_ENUM.indexOf(role);

export const getERC20TokenBalanceForOwner = publicProcedure
  .input(
    z.object({
      chainId: z.number(),
      tokenAddress: z.string(),
      owner: z.string(),
    })
  )
  .query(async ({ input, ctx }) => {
    // Sui address length is 66
    if (input.tokenAddress?.length === 66) {
      let isTokenOwner = false;

      const client = new SuiClient({ url: getFullnodeUrl("testnet") }); // TODO: make this configurable

      // Get the coin type
      const modules = await client.getNormalizedMoveModulesByPackage({
        package: input.tokenAddress,
      });
      const coinSymbol = Object.keys(modules)[0];
      const coinType = `${input.tokenAddress}::${coinSymbol?.toLocaleLowerCase()}::${coinSymbol?.toUpperCase()}`;

      // Get the coin balance
      const coins = await client.getCoins({
        owner: input.owner,
        coinType: coinType,
      });
      const balance = coins.data[0].balance.toString();

      // Get the coin metadata
      const metadata = await client.getCoinMetadata({ coinType });

      // Get the token owner
      const object = await client.getObject({
        id: input.tokenAddress,
        options: {
          showOwner: true,
          showPreviousTransaction: true,
        },
      });
      if (object.data && "Immutable" === object.data.owner) {
        const previousTx = object.data.previousTransaction;

        // Fetch the transaction details to find the sender
        const transactionDetails = await client.getTransactionBlock({
          digest: previousTx as string,
          options: { showInput: true, showEffects: true },
        });
        isTokenOwner =
          transactionDetails.transaction?.data.sender === input.owner;
      }

      const result = {
        isTokenOwner,
        isTokenMinter: isTokenOwner,
        tokenBalance: balance,
        decimals: metadata?.decimals ?? 0,
        isTokenPendingOwner: false,
        hasPendingOwner: false,
        hasMinterRole: isTokenOwner,
        hasOperatorRole: isTokenOwner,
        hasFlowLimiterRole: isTokenOwner, // TODO: check if this is correct
      };
      return result;
    }

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
        client.reads.balanceOf({ account: input.owner }),
        client.reads.decimals(),
        client.reads.owner().catch(always(null)),
        client.reads.pendingOwner().catch(always(null)),
      ]);

      const itClient = ctx.contracts.createInterchainTokenClient(
        chainConfig,
        input.tokenAddress
      );

      const [
        isTokenMinter,
        hasMinterRole,
        hasOperatorRole,
        hasFlowLimiterRole,
      ] = await Promise.all(
        [
          itClient.reads.isMinter({
            addr: input.owner,
          }),
          itClient.reads.hasRole({
            role: getRoleIndex("MINTER"),
            account: input.owner,
          }),
          itClient.reads.hasRole({
            role: getRoleIndex("OPERATOR"),
            account: input.owner,
          }),
          itClient.reads.hasRole({
            role: getRoleIndex("FLOW_LIMITER"),
            account: input.owner,
          }),
        ].map((p) => p.catch(always(false)))
      );

      const isTokenOwner = owner === input.owner;

      return {
        isTokenOwner,
        isTokenMinter,
        tokenBalance: tokenBalance.toString(),
        decimals,
        isTokenPendingOwner: pendingOwner === input.owner,
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
