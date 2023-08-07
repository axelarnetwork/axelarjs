import { type InferModel } from "drizzle-orm";
import {
  integer,
  pgEnum,
  pgTable,
  smallint,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const kindEnum = pgEnum("kind", ["canonical", "standardized"]);

/**
 * Interchain Tokens
 *
 * This table is used to track the interchain tokens that are deployed on the origin chain.
 */
export const interchainTokens = pgTable("interchain_tokens", {
  tokenId: varchar("token_id", { length: 66 }).primaryKey(),
  tokenAddress: varchar("token_address", { length: 42 }).notNull(),
  tokenName: varchar("token_name", { length: 100 }).notNull(),
  tokenSymbol: varchar("token_symbol", { length: 100 }).notNull(),
  tokenDecimals: smallint("token_decimals").notNull(),
  chainId: integer("chain_id").notNull(),
  axelarChainId: varchar("axelar_chain_id", { length: 66 }).notNull(),
  deploymentTxHash: varchar("deployment_tx_hash", { length: 66 }),
  deployerAddress: varchar("deployer_address", { length: 42 }).notNull(),
  kind: kindEnum("kind").notNull(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  // only for kind=standardized
  salt: varchar("salt", { length: 66 }),
});

/**
 * CRUD Schemas
 *
 * These schemas are used to validate the input and output of CRUD operations.
 */
export const interchainTokensZodSchemas = {
  insert: createInsertSchema(interchainTokens),
  select: createSelectSchema(interchainTokens),
};

export type InterchainTokenModel = InferModel<typeof interchainTokens>;
