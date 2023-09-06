import type { Address } from "viem";

import type { DBClient } from "~/lib/drizzle/client";
import {
  interchainTokens,
  remoteInterchainTokens,
  type NewInterchainToken,
  type NewRemoteInterchainToken,
} from "~/lib/drizzle/schema";

type NewRemoteInterchainTokenInput = Omit<
  NewRemoteInterchainToken,
  "createdAt" | "updatedAt"
>;

type NewInterchainTokenInput = Omit<
  NewInterchainToken,
  "createdAt" | "updatedAt"
>;

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
   * Returns the interchain token with the given `tokenId`,
   * including its remote interchain tokens.
   */
  async getInterchainTokenByTokenId(tokenId: string) {
    const query = this.db.query.interchainTokens.findFirst({
      where: (table, { eq }) => eq(table.tokenId, tokenId),
      with: {
        remoteInterchainTokens: true,
      },
    });

    return await query;
  }

  /**
   * Returns the interchain token with the given `chainId` and `tokenAddress`,
   * including its remote interchain tokens.
   */
  async getInterchainTokenByChainIdAndTokenAddress(
    chainId: number,
    tokenAddress: Address
  ) {
    const query = this.db.query.interchainTokens.findFirst({
      where: (table, { eq, and }) =>
        and(eq(table.chainId, chainId), eq(table.tokenAddress, tokenAddress)),
      with: {
        remoteInterchainTokens: true,
      },
    });

    return await query;
  }
}
