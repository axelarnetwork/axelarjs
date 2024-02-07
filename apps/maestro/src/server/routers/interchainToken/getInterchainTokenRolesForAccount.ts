import { z } from "zod";

import { hex40Literal, hex64Literal } from "~/lib/utils/validation";
import { publicProcedure } from "~/server/trpc";
import {
  getRoleIndex,
  ROLES_ENUM,
  type TokenRole,
} from "../erc20/getERC20TokenBalanceForOwner";

export const getInterchainTokenRolesForAccount = publicProcedure
  .input(
    z.object({
      tokenId: hex64Literal(),
      accountAddress: hex40Literal(),
    })
  )
  .query(async ({ ctx, input }) => {
    const tokenDetails =
      await ctx.persistence.postgres.getInterchainTokenByTokenId(input.tokenId);

    if (!tokenDetails) {
      return {
        tokenManager: [] as TokenRole[],
        token: [] as TokenRole[],
      };
    }

    const chains = await ctx.configs.evmChains();
    const configs = chains[tokenDetails.axelarChainId];

    if (!configs) {
      return {
        tokenManager: [] as TokenRole[],
        token: [] as TokenRole[],
      };
    }

    const tokenManagerClient = ctx.contracts.createTokenManagerClient(
      configs.wagmi,
      tokenDetails.tokenManagerAddress as `0x${string}`
    );

    const tokenClient = ctx.contracts.createInterchainTokenClient(
      configs.wagmi,
      tokenDetails.tokenAddress as `0x${string}`
    );

    const tokenRoles = await Promise.all(
      ROLES_ENUM.map((role) =>
        tokenClient.reads
          .hasRole({
            account: input.accountAddress,
            role: getRoleIndex(role),
          })
          .then((hasRole) => [role, hasRole] as const)
          .catch(() => [role, false] as const)
      )
    );

    const tokenManagerRoles = await Promise.all(
      ROLES_ENUM.map((role) =>
        tokenManagerClient.reads
          .hasRole({
            account: input.accountAddress,
            role: getRoleIndex(role),
          })
          .then((hasRole) => [role, hasRole] as const)
          .catch(() => [role, false] as const)
      )
    );

    return {
      tokenManager: tokenManagerRoles
        .filter(([, hasRole]) => hasRole)
        .map(([role]) => role),
      token: tokenRoles.filter(([, hasRole]) => hasRole).map(([role]) => role),
    };
  });
