import { timestamp, varchar } from "drizzle-orm/pg-core";

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
 * This is a unique identifier for the token. Format: `0x${string}`
 */
export const tokenId = varchar("token_id", { length: HASH_LENGTH });

/**
 * Token address. Format: `0x${string}`
 */
export const tokenAddress = varchar("token_address", {
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
