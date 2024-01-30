import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { pgEnum, pgTable, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import {
  ADDRESS_LENGTH,
  axelarChainId,
  createdAt,
  deploymentMessageId,
  HASH_LENGTH,
  tokenAddress,
  tokenManagerTypeEnum,
  updatedAt,
} from "./common";
import { interchainTokens } from "./interchainTokens";

export const deplymentStatusEnum = pgEnum("deployment_status", [
  "confirmed",
  "pending",
]);

/**
 * Remote Interchain Tokens
 *
 * This table is used to track the remote interchain tokens that are deployed
 * on other chains. The `originTokenId` field is used to link the remote
 * interchain token to the original interchain token.
 */
export const remoteInterchainTokens = pgTable("remote_interchain_tokens", {
  /**
   * Unique identifier for the remote interchain token.
   * `${axelarchainId}:${tokenAddress}`.
   */
  id: varchar("id", { length: 128 }).primaryKey(),
  tokenId: varchar("token_id", { length: HASH_LENGTH })
    .notNull()
    .references(() => interchainTokens.tokenId),
  axelarChainId: axelarChainId.notNull(),
  tokenAddress: tokenAddress.notNull(),
  tokenManagerAddress: varchar("token_manager_address", {
    length: ADDRESS_LENGTH,
  }),
  tokenManagerType: tokenManagerTypeEnum("token_manager_type"),
  deploymentMessageId: deploymentMessageId.notNull(),
  deploymentStatus: deplymentStatusEnum("deployment_status").default("pending"),
  createdAt,
  updatedAt,
});

/**
 * CRUD Schemas
 *
 * These schemas are used to validate the input and output of CRUD operations.
 */
export const remoteInterchainTokensZodSchemas = {
  insert: createInsertSchema(remoteInterchainTokens),
  select: createSelectSchema(remoteInterchainTokens),
};

export type RemoteInterchainToken = InferSelectModel<
  typeof remoteInterchainTokens
>;

export type NewRemoteInterchainToken = InferInsertModel<
  typeof remoteInterchainTokens
>;
