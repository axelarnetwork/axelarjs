import { TRPCError } from "@trpc/server";
import { always } from "rambda";
import { Account, Address, scValToNative } from "stellar-sdk";
import { z } from "zod";

import { suiClient as client } from "~/lib/clients/suiClient";
import { isValidStellarTokenAddress } from "~/lib/utils/validation";
import { queryCoinMetadata } from "~/server/routers/sui/graphql";
import { publicProcedure } from "~/server/trpc";
import { getStellarChainConfig } from "../stellar/utils";
import { STELLAR_NETWORK_PASSPHRASE } from "../stellar/utils/config";
import { simulateCall } from "../stellar/utils/transactions";
import { getCoinInfoByCoinType, getSuiChainConfig } from "../sui/utils/utils";

// Helper function to call Stellar contract methods and handle errors
async function callStellarContractMethod<T>({
  contractAddress,
  method,
  account,
  args = [],
  rpcUrl,
}: {
  contractAddress: string;
  method: string;
  account: Account;
  args?: any[];
  rpcUrl: string;
}): Promise<T | undefined> {
  try {
    const result = await simulateCall({
      contractAddress,
      method,
      account,
      args,
      rpcUrl,
      networkPassphrase: STELLAR_NETWORK_PASSPHRASE,
    });

    if (result.simulateResult) {
      const nativeValue = scValToNative(result.simulateResult);
      return nativeValue as T;
    } else {
      return undefined;
    }
  } catch (error) {
    return undefined;
  }
}

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
    const normalizedTokenAddress = input.tokenAddress?.includes(":")
      ? input.tokenAddress.split(":")[0] // use only the first part of the address for sui
      : input.tokenAddress;
    // A user can have a token on a different chain, but the if address is the same as for all EVM chains, they can check their balance
    // To check sui for example, they need to connect with a sui wallet
    const isIncompatibleChain =
      normalizedTokenAddress?.length !== input.owner?.length;
    if (isIncompatibleChain) {
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
    // Sui coin type is in the format of packageId::module::MODULE
    if (input.tokenAddress?.includes(":")) {
      const chainConfig = await getSuiChainConfig(ctx);

      const { totalBalance: balance } = await client.getBalance({
        owner: input.owner,
        coinType: input.tokenAddress,
      });

      const InterchainTokenServiceV0 =
        chainConfig.config.contracts?.InterchainTokenService.objects
          .InterchainTokenServicev0;

      if (!InterchainTokenServiceV0) {
        throw new Error("Invalid chain config");
      }

      const coinInfo = await getCoinInfoByCoinType(
        client,
        input.tokenAddress,
        InterchainTokenServiceV0
      );

      let decimals = coinInfo?.decimals;
      // Get the coin metadata

      await queryCoinMetadata(input.tokenAddress)
        .then((metadata) => (decimals = metadata?.decimals))
        .catch((e) => {
          console.log("error in queryCoinMetadata", e);
        });

      const isOperator = input.owner === coinInfo?.operator;
      const isDistributor = input.owner === coinInfo?.distributor;

      const result = {
        isTokenOwner: isOperator,
        isTokenMinter: isDistributor,
        tokenBalance: balance.toString(),
        decimals,
        isTokenPendingOwner: false,
        hasPendingOwner: false,
        hasMinterRole: isDistributor,
        hasOperatorRole: isOperator,
        hasFlowLimiterRole: isOperator,
      };

      return result;
    }

    // Stellar tokens
    if (isValidStellarTokenAddress(input.tokenAddress)) {
      try {
        const chainConfig = await getStellarChainConfig(ctx);
        const rpcUrl = chainConfig.config.rpc[0];

        const dummyAccount = new Account(input.owner, "0");

        const decimalsRaw = await callStellarContractMethod<number>({
          contractAddress: input.tokenAddress,
          method: "decimals",
          account: dummyAccount,
          rpcUrl,
        });

        const decimals = decimalsRaw !== undefined ? decimalsRaw : 0;

        const balanceRaw = await callStellarContractMethod<any>({
          contractAddress: input.tokenAddress,
          method: "balance",
          account: dummyAccount,
          args: [new Address(input.owner).toScVal()],
          rpcUrl,
        });

        let balance = "0";
        if (balanceRaw) {
          balance = String(balanceRaw).replace("n", "");
        }

        const ownerAddressObj = await callStellarContractMethod<any>({
          contractAddress: input.tokenAddress,
          method: "owner",
          account: dummyAccount,
          rpcUrl,
        });

        // Owner check
        const isTokenOwner = ownerAddressObj === input.owner;

        const isTokenMinter =
          (await callStellarContractMethod<boolean>({
            contractAddress: input.tokenAddress,
            method: "is_minter",
            account: dummyAccount,
            args: [new Address(input.owner).toScVal()],
            rpcUrl,
          })) || false;

        const result = {
          decimals,
          isTokenOwner,
          isTokenMinter,
          tokenBalance: balance ? balance.toString() : "0",
          isTokenPendingOwner: false,
          hasPendingOwner: false,
          hasMinterRole: !!isTokenMinter,
          hasOperatorRole: !!isTokenOwner,
          hasFlowLimiterRole: !!isTokenOwner,
        };

        return result;
      } catch (error) {
        console.error(
          `[Stellar] Error in token balance retrieval for ${input.tokenAddress}:`,
          error
        );
        return {
          decimals: 0,
          isTokenOwner: false,
          isTokenMinter: false,
          tokenBalance: "0",
          isTokenPendingOwner: false,
          hasPendingOwner: false,
          hasMinterRole: false,
          hasOperatorRole: false,
          hasFlowLimiterRole: false,
        };
      }
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
