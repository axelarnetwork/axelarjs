import type { InferModel } from "drizzle-orm";
import {
  integer,
  pgEnum,
  pgTable,
  smallint,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { ADDRESS_LENGTH, HASH_LENGTH } from "./common";

export const kindEnum = pgEnum("kind", ["canonical", "standardized"]);

/**
 * Interchain Tokens
 *
 * This table is used to track the interchain tokens that are deployed on the origin chain.
 */
export const interchainTokens = pgTable("interchain_tokens", {
  tokenId: varchar("token_id", { length: HASH_LENGTH }).primaryKey(),
  tokenAddress: varchar("token_address", { length: ADDRESS_LENGTH }).notNull(),
  tokenName: varchar("token_name", { length: 100 }).notNull(),
  tokenSymbol: varchar("token_symbol", { length: 100 }).notNull(),
  tokenDecimals: smallint("token_decimals").notNull(),
  chainId: integer("chain_id").notNull(),
  axelarChainId: varchar("axelar_chain_id", { length: HASH_LENGTH }).notNull(),
  deploymentTxHash: varchar("deployment_tx_hash", { length: HASH_LENGTH }),
  deployerAddress: varchar("deployer_address", {
    length: ADDRESS_LENGTH,
  }).notNull(),
  kind: kindEnum("kind").notNull(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  // only for kind=standardized
  salt: varchar("salt", { length: HASH_LENGTH }),
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

export type InterchainToken = InferModel<typeof interchainTokens>;

export type NewInterchainToken = InferModel<typeof interchainTokens, "insert">;
