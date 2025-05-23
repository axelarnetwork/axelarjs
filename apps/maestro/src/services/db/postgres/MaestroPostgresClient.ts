import { and, eq, ilike, inArray } from "drizzle-orm";
import { z } from "zod";

import type { DBClient } from "~/lib/drizzle/client";
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
    await this.db.transaction(async (tx) => {
      const existingTokens = await tx.query.remoteInterchainTokens.findMany({
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
                    v.axelarChainId === t.axelarChainId &&
                    v.tokenId === t.tokenId
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
        for (const [existingToken, updateValue] of updateValues) {
          await tx
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
            .where(eq(remoteInterchainTokens.id, existingToken.id));
        }
      }

      if (!insertValues.length) {
        return;
      }

      await tx.insert(remoteInterchainTokens).values(
        insertValues.map((v) => ({
          ...v,
          id: `${v.axelarChainId}:${v.tokenAddress}`,
          createdAt: new Date(),
          updatedAt: new Date(),
        }))
      );
    });
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

  async updateInterchainTokenDeploymentMessageId(
    tokenId: string,
    deploymentMessageId: string
  ) {
    await this.db
      .update(interchainTokens)
      .set({ deploymentMessageId, updatedAt: new Date() })
      .where(eq(interchainTokens.tokenId, tokenId));
  }

  async updateRemoteInterchainTokenDeploymentMessageId(
    tokenId: string,
    axelarChainId: string,
    deploymentMessageId: string
  ) {
    await this.db
      .update(remoteInterchainTokens)
      .set({ deploymentMessageId, updatedAt: new Date() })
      .where(
        and(
          eq(remoteInterchainTokens.tokenId, tokenId),
          ilike(remoteInterchainTokens.axelarChainId, axelarChainId)
        )
      );
  }

  /**
   * Returns the interchain token with the given `chainId` and `tokenAddress`,
   * including its remote interchain tokens.
   */
  async getInterchainTokenByChainIdAndTokenAddress(
    axelarChainId: string,
    tokenAddress: string
  ) {
    const query = this.db.query.interchainTokens.findFirst({
      where: (table, { ilike, and }) =>
        and(
          ilike(table.axelarChainId, axelarChainId),
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
    tokenAddress: string
  ) {
    const query = this.db.query.remoteInterchainTokens.findFirst({
      where: (table, { ilike, and }) =>
        and(
          ilike(table.axelarChainId, axelarChainId),
          ilike(table.tokenAddress, tokenAddress)
        ),
    });

    return await query;
  }

  /**
   * Returns the interchain tokens deployed by the given `deployerAddress`,
   */
  async getInterchainTokensByDeployerAddress(deployerAddress: string) {
    const query = this.db.query.interchainTokens.findMany({
      where: (table, { ilike }) =>
        ilike(table.deployerAddress, deployerAddress),
    });

    return await query;
  }

  /**
   * Returns all the interchain tokens deployed filtering by type.
   */
  async getAllDeployedInterchainTokens(
    tokenType: "interchain" | "canonical" | "all" = "all"
  ) {
    const query = this.db.query.interchainTokens.findMany({
      where: (table, { notIlike, eq, and }) =>
        tokenType === "all"
          ? notIlike(table.deploymentMessageId, "")
          : and(
              notIlike(table.deploymentMessageId, ""),
              eq(table.kind, tokenType as "interchain" | "canonical")
            ),
      orderBy: ({ createdAt }, { desc }) => desc(createdAt),
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

  async updateStellarRemoteTokenAddresses(inputs: {
    tokenId: string;
    tokenAddress: string;
    tokenManagerAddress: string;
  }) {
    await this.db
      .update(remoteInterchainTokens)
      .set({
        deploymentStatus: "confirmed",
        tokenAddress: inputs.tokenAddress,
        tokenManagerAddress: inputs.tokenManagerAddress,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(remoteInterchainTokens.tokenId, inputs.tokenId),
          ilike(remoteInterchainTokens.axelarChainId, "%stellar%")
        )
      );
  }

  async updateSuiRemoteTokenAddresses(inputs: {
    tokenId: string;
    tokenAddress: string;
    tokenManager: string;
  }) {
    try {
      const { tokenId, tokenAddress, tokenManager } = inputs;

      await this.db
        .update(remoteInterchainTokens)
        .set({
          tokenAddress,
          tokenManagerAddress: tokenManager,
          deploymentStatus: "confirmed",
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(remoteInterchainTokens.tokenId, tokenId),
            ilike(remoteInterchainTokens.axelarChainId, "%sui%")
          )
        );
    } catch (error) {
      console.error("Failed to update Sui remote token addresses:", error);
    }
  }

  async updateEVMRemoteTokenAddress(tokenId: string, tokenAddress: string) {
    await this.db
      .update(remoteInterchainTokens)
      .set({ tokenAddress, updatedAt: new Date() })
      .where(eq(remoteInterchainTokens.tokenId, tokenId));
  }
}
