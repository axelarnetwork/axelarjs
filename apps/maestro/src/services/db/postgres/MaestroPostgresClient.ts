import { and, eq, inArray } from "drizzle-orm";
import { type Address } from "viem";
import { z } from "zod";

import type { BatchItems, DBClient } from "~/lib/drizzle/client";
import {
  AuditLogEvent,
  AuditLogEventKind,
  auditLogs,
  interchainTokens,
  interchainTokensZodSchemas,
  remoteInterchainTokens,
  remoteInterchainTokensZodSchemas,
} from "~/lib/drizzle/schema";

export const newRemoteInterchainTokenSchema =
  remoteInterchainTokensZodSchemas.insert.omit({
    createdAt: true,
    updatedAt: true,
    id: true,
  });

export const newInterchainTokenSchema = interchainTokensZodSchemas.insert.omit({
  createdAt: true,
  updatedAt: true,
});

const sanitizeObject = <
  const T extends Record<string, any> = Record<string, any>,
>(
  obj: T
) => Object.fromEntries(Object.entries(obj).filter(([, v]) => Boolean(v)));

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
    const existingToken = await this.db.query.interchainTokens.findFirst({
      where: (table, { eq }) => eq(table.tokenId, value.tokenId),
    });

    if (existingToken) {
      await this.db
        .update(interchainTokens)
        .set({
          deploymentMessageId: value.deploymentMessageId,
          tokenManagerType: value.tokenManagerType,
          tokenManagerAddress:
            value.tokenManagerAddress ?? existingToken.tokenManagerAddress,
          updatedAt: new Date(),
        })
        .where(eq(interchainTokens.tokenId, existingToken.tokenId));

      return;
    }

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
    await this.db.insert(remoteInterchainTokens).values({
      ...value,
      id: `${value.axelarChainId}:${value.tokenAddress}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  /**
   * Records the deployment of multiple remote interchain tokens.
   *
   * @param _variables
   * @returns
   */
  async recordRemoteInterchainTokenDeployments(
    values: NewRemoteInterchainTokenInput[]
  ) {
    const existingTokens = await this.db.query.remoteInterchainTokens.findMany({
      where: (table, { eq }) => eq(table.tokenId, values[0].tokenId),
    });

    const updateValues = existingTokens
      .map(
        (t) =>
          [
            t,
            sanitizeObject(
              values.find(
                (v) =>
                  v.axelarChainId === t.axelarChainId && v.tokenId === t.tokenId
              ) ?? {}
            ),
          ] as const
      )
      .filter(([, v]) => Boolean(v));

    const insertValues = values.filter((v) => {
      const id = `${v.axelarChainId}:${v.tokenAddress}`;
      return !existingTokens.some((t) => t.id === id);
    });

    if (updateValues.length > 0) {
      const [first, ...rest] = updateValues.map(
        ([existingToken, updateValue]) =>
          this.db
            .update(remoteInterchainTokens)
            .set({
              id: updateValue.id ?? existingToken.id,
              tokenManagerAddress:
                updateValue.tokenManagerAddress ??
                existingToken.tokenManagerAddress,
              deploymentMessageId:
                updateValue.deploymentMessageId ??
                existingToken.deploymentMessageId,
              deploymentStatus:
                updateValue.deploymentStatus ?? existingToken.deploymentStatus,
              tokenManagerType:
                updateValue.tokenManagerType ?? existingToken.tokenManagerType,
              tokenAddress:
                updateValue.tokenAddress ?? existingToken.tokenAddress,
              updatedAt: new Date(),
            })
            .where(eq(remoteInterchainTokens.id, existingToken.id))
      );

      // only batch if there are more than one update
      if (!rest.length) {
        await first;
      } else {
        await this.db.batch([first, ...rest] as BatchItems);
      }
    }

    if (!insertValues.length) {
      return;
    }

    await this.db.insert(remoteInterchainTokens).values(
      insertValues.map((v) => ({
        ...v,
        id: `${v.axelarChainId}:${v.tokenAddress}`,
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
      .set({ deploymentStatus, updatedAt: new Date() })
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
      where: (table, { ilike }) => ilike(table.tokenId, tokenId),
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
      where: (table, { ilike, and }) =>
        and(
          eq(table.axelarChainId, axelarChainId),
          ilike(table.tokenAddress, tokenAddress)
        ),
      with: {
        remoteTokens: true,
      },
    });

    return await query;
  }

  /**
   * Returns the interchain token on the remote tokens table with the given `chainId` and `tokenAddress`.
   */
  async getRemoteInterchainTokenByChainIdAndTokenAddress(
    axelarChainId: string,
    tokenAddress: Address
  ) {
    const query = this.db.query.remoteInterchainTokens.findFirst({
      where: (table, { ilike, and }) =>
        and(
          eq(table.axelarChainId, axelarChainId),
          ilike(table.tokenAddress, tokenAddress)
        ),
    });

    return await query;
  }

  /**
   * Returns the interchain tokens deployed by the given `deployerAddress`,
   */
  async getInterchainTokensByDeployerAddress(deployerAddress: Address) {
    const query = this.db.query.interchainTokens.findMany({
      where: (table, { ilike }) =>
        ilike(table.deployerAddress, deployerAddress),
    });

    return await query;
  }

  async recordAuditLogEvent<T extends AuditLogEventKind>(
    event: AuditLogEvent<T>
  ) {
    await this.db.insert(auditLogs).values({
      eventKind: event.kind,
      payload: JSON.stringify(event.payload),
    });
  }

  async getAuditLogs() {
    const query = this.db.query.auditLogs.findMany({
      orderBy: ({ timestamp }, { desc }) => desc(timestamp),
    });

    return await query;
  }

  async getAuditLogsByEventKind(eventKind: AuditLogEventKind) {
    const query = this.db.query.auditLogs.findMany({
      where: (table, { eq }) => eq(table.eventKind, eventKind),
      orderBy: ({ timestamp }, { desc }) => desc(timestamp),
    });

    return await query;
  }
}
