import { PgEnum, pgEnum, timestamp, varchar } from "drizzle-orm/pg-core";

export const HASH_LENGTH = 66;

// common fields

/**
 * This is a composite field. Format: `${string)-${number}`
 */
export const deploymentMessageId = varchar("deployment_message_id");

/**
 * Token address. Format: `${string}`
 */
export const tokenAddress = varchar("token_address");

/**
 * This is the address of the account. Format: `${string}`
 */
export const accountAddress = varchar("account_address");

/**
 * This is the address of the token manager contract. Format: `${string}`
 */
export const tokenManagerAddress = varchar("token_manager_address");

/**
 * This is an internal identifier for the chain. Format: `${string}`
 */
export const axelarChainId = varchar("axelar_chain_id");

export const createdAt = timestamp("created_at").defaultNow();

export const updatedAt = timestamp("updated_at").defaultNow();

export const TOKEN_MANAGER_TYPES = [
  "mint_burn",
  "mint_burn_from",
  "lock_unlock",
  "lock_unlock_fee",
  "gateway"
] as const;

export const getTokenManagerType = (tokenManagerType: TokenManagerType) =>
  BigInt(TOKEN_MANAGER_TYPES.indexOf(tokenManagerType));

export const getTokenManagerTypeFromBigInt = (tokenManagerType: bigint) =>
  TOKEN_MANAGER_TYPES[Number(tokenManagerType)];

export const tokenManagerTypeEnum = pgEnum(
  "token_manager_type",
  TOKEN_MANAGER_TYPES
);

export type TokenManagerType =
  typeof tokenManagerTypeEnum extends PgEnum<infer T>
    ? T extends any[]
      ? T[number]
      : never
    : never;
