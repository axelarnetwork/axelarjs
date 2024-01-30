import { PgEnum, pgEnum, timestamp, varchar } from "drizzle-orm/pg-core";

export const ADDRESS_LENGTH = 42;
export const HASH_LENGTH = 66;

// common fields

/**
 * This is a composite field. Format: `0x${string)-${number}`
 */
export const deploymentMessageId = varchar("deployment_message_id", {
  length: HASH_LENGTH + 5, // up to 10k indexes
});

/**
 * Token address. Format: `0x${string}`
 */
export const tokenAddress = varchar("token_address", {
  length: ADDRESS_LENGTH,
});

/**
 * This is the address of the account. Format: `0x${string}`
 */
export const accountAddress = varchar("account_address", {
  length: ADDRESS_LENGTH,
});

/**
 * This is the address of the token manager contract. Format: `0x${string}`
 */
export const tokenManagerAddress = varchar("token_manager_address", {
  length: ADDRESS_LENGTH,
});

/**
 * This is an internal identifier for the chain. Format: `${string}`
 */
export const axelarChainId = varchar("axelar_chain_id", {
  length: HASH_LENGTH,
});

export const createdAt = timestamp("created_at").defaultNow();

export const updatedAt = timestamp("updated_at").defaultNow();

const TOKEN_MANAGER_TYPES = [
  "MIN_BURN",
  "MINT_BURN_FROM",
  "LOCK_UNLOCK",
  "LOCK_UNLOCK_FEE",
  "GATEWAY",
] as const;

export const getTokenManagerType = (tokenManagerType: TokenManagerType) =>
  BigInt(TOKEN_MANAGER_TYPES.indexOf(tokenManagerType));

export const getTokenManagerTypeFromBigInt = (tokenManagerType: bigint) =>
  TOKEN_MANAGER_TYPES[Number(tokenManagerType)];

export const tokenManagerTypeEnum = pgEnum(
  "token_manager_type",
  TOKEN_MANAGER_TYPES
);

export type TokenManagerType = typeof tokenManagerTypeEnum extends PgEnum<
  infer T
>
  ? T extends any[]
    ? T[number]
    : never
  : never;
