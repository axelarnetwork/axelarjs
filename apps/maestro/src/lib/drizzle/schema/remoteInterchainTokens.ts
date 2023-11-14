import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { pgEnum, pgTable, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import {
  ADDRESS_LENGTH,
  axelarChainId,
  createdAt,
  deploymentMessageId,
  tokenAddress,
  tokenId,
  updatedAt,
} from "./common";
import { interchainTokens } from "./interchainTokens";

export const deplymentStatusEnum = pgEnum("status", ["confirmed", "pending"]);

/**
 * Remote Interchain Tokens
 *
 * This table is used to track the remote interchain tokens that are deployed
 * on other chains. The `originTokenId` field is used to link the remote
 * interchain token to the original interchain token.
 */
export const remoteInterchainTokens = pgTable("remote_interchain_tokens", {
  tokenId: tokenId
    .notNull()
    .primaryKey()
    .references(() => interchainTokens.tokenId),
  axelarChainId: axelarChainId.notNull().primaryKey(),
  tokenAddress: tokenAddress.notNull(),
  tokenManagerAddress: varchar("token_manager_address", {
    length: ADDRESS_LENGTH,
  }).notNull(),
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
