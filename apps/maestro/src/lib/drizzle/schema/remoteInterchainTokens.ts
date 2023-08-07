import { type InferModel } from "drizzle-orm";
import {
  integer,
  pgEnum,
  pgTable,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const deplymentStatusEnum = pgEnum("status", ["deployed", "pending"]);

/**
 * Remote Interchain Tokens
 *
 * This table is used to track the remote interchain tokens that are deployed
 * on other chains. The `originTokenId` field is used to link the remote
 * interchain token to the original interchain token.
 */
export const remoteInterchainTokens = pgTable("remote_interchain_tokens", {
  tokenId: varchar("token_id", { length: 66 }).primaryKey(),
  originTokenId: varchar("origin_token_id", { length: 66 }),
  chainId: integer("chain_id"),
  axelarChainId: varchar("axelar_chain_id"),
  address: varchar("address", { length: 42 }),
  deploymentTxHash: varchar("deployment_tx_hash", { length: 66 }),
  deploymentLogIndex: integer("deployment_log_index"),
  deploymentStatus: deplymentStatusEnum("deployment_status"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
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

export type RemoteInterchainTokenModel = InferModel<
  typeof remoteInterchainTokens
>;
