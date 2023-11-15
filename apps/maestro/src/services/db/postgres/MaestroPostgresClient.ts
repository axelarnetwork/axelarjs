import { and, eq, inArray } from "drizzle-orm";
import type { Address } from "viem";
import { z } from "zod";

import type { DBClient } from "~/lib/drizzle/client";
import {
  interchainTokens,
  interchainTokensZodSchemas,
  remoteInterchainTokens,
  remoteInterchainTokensZodSchemas,
} from "~/lib/drizzle/schema";

export const newRemoteInterchainTokenSchema =
  remoteInterchainTokensZodSchemas.insert.omit({
    createdAt: true,
    updatedAt: true,
  });

export const newInterchainTokenSchema = interchainTokensZodSchemas.insert.omit({
  createdAt: true,
  updatedAt: true,
});

export type NewRemoteInterchainTokenInput = z.infer<
  typeof newRemoteInterchainTokenSchema
>;

export type NewInterchainTokenInput = z.infer<typeof newInterchainTokenSchema>;

export default class MaestroPostgresClient {
  constructor(private db: DBClient) {}

  /**
   * Records the deployment of an interchain token.
   *
   * @param interchainToken
   * @returns
   */
  async recordInterchainTokenDeployment(value: NewInterchainTokenInput) {
    await this.db
      .insert(interchainTokens)
      .values({ ...value, createdAt: new Date(), updatedAt: new Date() });
  }

  /**
   * Records the deployment of a remote interchain token.
   *
   * @param _variables
   * @returns
   */
  async recordRemoteInterchainTokenDeployment(
    value: NewRemoteInterchainTokenInput
  ) {
    await this.db
      .insert(remoteInterchainTokens)
      .values({ ...value, createdAt: new Date(), updatedAt: new Date() });
  }

  /**
   * Records the deployment of multiple remote interchain tokens.
   *
   * @param _variables
   * @returns
   */
  async recordRemoteInterchainTokenDeployments(
    value: NewRemoteInterchainTokenInput[]
  ) {
    await this.db.insert(remoteInterchainTokens).values(
      value.map((v) => ({
        ...v,
        createdAt: new Date(),
        updatedAt: new Date(),
      }))
    );
  }

  /**
   * Updates the deployment status of a list of remote interchain tokens.
   */
  async updateRemoteInterchainTokenDeploymentsStatus(
    tokenId: string,
    deploymentStatus: "confirmed" | "pending",
    axelarChainIds: string[]
  ) {
    await this.db
      .update(remoteInterchainTokens)
      .set({ deploymentStatus })
      .where(
        and(
          eq(remoteInterchainTokens.tokenId, tokenId),
          inArray(remoteInterchainTokens.axelarChainId, axelarChainIds)
        )
      );
  }

  /**
   * Returns the interchain token with the given `tokenId`,
   * including its remote interchain tokens.
   */
  async getInterchainTokenByTokenId(tokenId: string) {
    const query = this.db.query.interchainTokens.findFirst({
      where: (table, { eq }) => eq(table.tokenId, tokenId),
      with: {
        remoteTokens: true,
      },
    });

    return await query;
  }

  /**
   * Returns the interchain token with the given `chainId` and `tokenAddress`,
   * including its remote interchain tokens.
   */
  async getInterchainTokenByChainIdAndTokenAddress(
    axelarChainId: string,
    tokenAddress: Address
  ) {
    const query = this.db.query.interchainTokens.findFirst({
      where: (table, { eq, and }) =>
        and(
          eq(table.axelarChainId, axelarChainId),
          eq(table.tokenAddress, tokenAddress)
        ),
      with: {
        remoteTokens: true,
      },
    });

    return await query;
  }

  /**
   * Returns the interchain tokens deployed by the given `deployerAddress`,
   */
  async getInterchainTokensByDeployerAddress(deployerAddress: Address) {
    const query = this.db.query.interchainTokens.findMany({
      where: (table, { eq }) => eq(table.deployerAddress, deployerAddress),
    });

    return await query;
  }
}
