import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { pgEnum, pgTable, smallint, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import {
  ADDRESS_LENGTH,
  axelarChainId,
  createdAt,
  deploymentMessageId,
  HASH_LENGTH,
  tokenAddress,
  tokenManagerAddress,
  updatedAt,
} from "./common";

export const tokenKindEnum = pgEnum("token_kind", [
  "canonical",
  "interchain",
  "custom",
]);

/**
 * Interchain Tokens
 *
 * This table is used to track the interchain tokens that are deployed on the origin chain.
 */
export const interchainTokens = pgTable("interchain_tokens", {
  tokenId: varchar("token_id", { length: HASH_LENGTH }).primaryKey(),
  tokenAddress: tokenAddress.notNull(),
  axelarChainId: axelarChainId.notNull(),
  tokenName: varchar("token_name", { length: 100 }).notNull(),
  tokenSymbol: varchar("token_symbol", { length: 100 }).notNull(),
  tokenDecimals: smallint("token_decimals").notNull(),
  deploymentMessageId: deploymentMessageId.notNull(),
  deployerAddress: varchar("deployer_address", {
    length: ADDRESS_LENGTH,
  }).notNull(),
  tokenManagerAddress: tokenManagerAddress.notNull(),
  originalMinterAddress: varchar("original_minter_address", {
    length: ADDRESS_LENGTH,
  }),
  kind: tokenKindEnum("kind").notNull(),
  createdAt,
  updatedAt,
  /**
   * Token deployment salt. Only applicable for kind=intechain|custom.
   */
  salt: varchar("salt", { length: HASH_LENGTH }).notNull().default("0x"),
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

export type InterchainToken = InferSelectModel<typeof interchainTokens>;
export type NewInterchainToken = InferInsertModel<typeof interchainTokens>;
