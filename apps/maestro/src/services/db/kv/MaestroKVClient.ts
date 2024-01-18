import type { VercelKV } from "@vercel/kv";
import { z } from "zod";

export const COLLECTIONS = {
  accounts: "accounts",
} as const;

/**
 * Account status
 * - enabled: account is enabled (default)
 * - limited:{comma-separated-features}: account cannot use certain features
 * - disabled: account is disabled (e.g. banned)
 * - privileged: account is privileged (e.g. admin)
 */
export type AccountStatus =
  | "enabled"
  | `limited:${string}`
  | "disabled"
  | "privileged";

export const COLLECTION_KEYS = {
  accountNonce: (accountAddress: `0x${string}`) =>
    `${COLLECTIONS.accounts}:${accountAddress}:nonce` as const,
  accountStatus: (accountAddress: `0x${string}`) =>
    `${COLLECTIONS.accounts}:${accountAddress}:status` as const,
  globalMessage: "messages:global" as const,
  accountMessage: (accountAddress: `0x${string}`) =>
    `messages:${accountAddress}` as const,
  cached: (key: string) => `cached:${key}` as const,
};

export const messageSchema = z.object({
  kind: z.enum(["modal", "banner"]),
  content: z.string(),
  startTimestamp: z.string().optional(),
  endTimestamp: z.string().optional(),
});

export type Message = z.infer<typeof messageSchema>;

export type MessageKind = Message["kind"];

export class BaseMaestroKVClient {
  constructor(protected kv: VercelKV) {}
}

export default class MaestroKVClient extends BaseMaestroKVClient {
  async createAccount(accountAddress: `0x${string}`) {
    const key = COLLECTION_KEYS.accountNonce(accountAddress);
    await this.kv.set(key, 0);
  }

  async getAccountNonce(accountAddress: `0x${string}`) {
    const key = COLLECTION_KEYS.accountNonce(accountAddress);
    return await this.kv.get<number>(key);
  }

  async incrementAccountNonce(accountAddress: `0x${string}`) {
    const key = COLLECTION_KEYS.accountNonce(accountAddress);
    return await this.kv.incr(key);
  }

  async getAccountStatus(accountAddress: `0x${string}`) {
    const key = COLLECTION_KEYS.accountStatus(accountAddress);
    return await this.kv.get<AccountStatus>(key);
  }

  async getAccounStatuses() {
    const match = COLLECTION_KEYS.accountStatus("*" as `0x${string}`);
    const [, keys] = await this.kv.scan(0, { match });
    const values = await this.kv.mget<AccountStatus[]>(keys);

    return keys.map((key, i) => ({
      // extract account address from key (e.g. "accounts:0x1234:status" -> "0x1234")
      accountAddress: key.split(":")[1] as `0x${string}`,
      status: values[i],
    }));
  }

  async getGlobalMessage() {
    const key = COLLECTION_KEYS.globalMessage;
    return await this.kv.hgetall<Message>(key);
  }

  async setGlobalMessage(message: Message) {
    const key = COLLECTION_KEYS.globalMessage;
    return await this.kv.hset(key, message);
  }

  async getAccountMessage(accountAddresss: `0x${string}`) {
    const key = COLLECTION_KEYS.accountMessage(accountAddresss);
    return await this.kv.hgetall<Message>(key);
  }

  async setCached<T>(cacheKey: string, value: T, ttl = 3600) {
    const key = COLLECTION_KEYS.cached(cacheKey);
    return await this.kv.set(key, value, { ex: ttl });
  }

  async getCached<T>(cacheKey: string) {
    const key = COLLECTION_KEYS.cached(cacheKey);
    return await this.kv.get<T>(key);
  }
}
