import type { VercelKV } from "@vercel/kv";
import { z } from "zod";

export const COLLECTIONS = {
  accounts: "accounts",
  ofac: "ofac",
} as const;

/**
 * Account status
 * - enabled: account is enabled (default)
 * - disabled: account is disabled (e.g. banned)
 * - privileged: account is privileged (e.g. admin)
 */
export type AccountStatus = "enabled" | "disabled" | "privileged";

export const COLLECTION_KEYS = {
  accountNonce: (accountAddress: string) =>
    `${COLLECTIONS.accounts}:${accountAddress}:nonce` as const,
  accountStatus: (accountAddress: string) =>
    `${COLLECTIONS.accounts}:${accountAddress}:status` as const,
  globalMessage: "messages:global" as const,
  accountMessage: (accountAddress: string) =>
    `messages:${accountAddress}` as const,
  tokenMeta: (tokenId: string) => `tokens:${tokenId}:meta` as const,
  cached: (key: string) => `cached:${key}` as const,
  // OFAC Sanctions keys
  ofacSanctionsWallets: "sanctions:wallets" as const,
  ofacSanctionsLastUpdate: "sanctions:lastUpdate" as const,
};

export const messageSchema = z.object({
  kind: z.enum(["modal", "banner"]),
  content: z.string(),
  startTimestamp: z.string().optional(),
  endTimestamp: z.string().optional(),
});

export type Message = z.infer<typeof messageSchema>;

export type MessageKind = Message["kind"];

export type TokenMeta = {
  iconUrl: string;
};

export class BaseMaestroKVClient {
  constructor(protected kv: VercelKV) {}
}

export default class MaestroKVClient extends BaseMaestroKVClient {
  async createAccount(accountAddress: string) {
    const key = COLLECTION_KEYS.accountNonce(accountAddress);
    await this.kv.set(key, 0);
  }

  async getAccountNonce(accountAddress: string) {
    const key = COLLECTION_KEYS.accountNonce(accountAddress);
    return await this.kv.get<number>(key);
  }

  async incrementAccountNonce(accountAddress: string) {
    const key = COLLECTION_KEYS.accountNonce(accountAddress);
    return await this.kv.incr(key);
  }

  async getAccountStatus(accountAddress: string) {
    const key = COLLECTION_KEYS.accountStatus(accountAddress);
    return await this.kv.get<AccountStatus>(key);
  }

  async setAccountStatus(accountAddress: string, newStatus: AccountStatus) {
    const oldStatus = await this.getAccountStatus(accountAddress);

    if (oldStatus === "privileged") {
      throw new Error("Cannot set status of privileged account");
    }

    const key = COLLECTION_KEYS.accountStatus(accountAddress);

    if (oldStatus === "disabled" && newStatus === "enabled") {
      // delete account status if it's disabled and we're enabling it
      await this.kv.del(key);
      return newStatus;
    }

    await this.kv.set(key, newStatus);
    return newStatus;
  }

  async getAccounStatuses() {
    const match = COLLECTION_KEYS.accountStatus("*" as string);
    const [, keys] = await this.kv.scan(0, { match });
    const values = await this.kv.mget<AccountStatus[]>(keys);

    return keys.map((key, i) => ({
      // extract account address from key (e.g. "accounts:0x1234:status" -> "0x1234")
      accountAddress: key.split(":")[1],
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

  async getAccountMessage(accountAddresss: string) {
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

  async invalidateCache(cacheKey: string) {
    const key = COLLECTION_KEYS.cached(cacheKey);
    return await this.kv.del(key);
  }

  async setTokenIconUrl(tokenId: string, iconUrl: string) {
    const key = COLLECTION_KEYS.tokenMeta(tokenId);
    return await this.kv.hset(key, { iconUrl });
  }

  async getTokenMeta(tokenId: string) {
    const key = COLLECTION_KEYS.tokenMeta(tokenId);
    return await this.kv.hgetall<TokenMeta>(key);
  }

  // OFAC Sanctions Methods
  async isWalletSanctioned(walletAddress: string): Promise<boolean> {
    return (
      (await this.kv.sismember(
        COLLECTION_KEYS.ofacSanctionsWallets,
        walletAddress.toLowerCase()
      )) === 1
    );
  }

  async setSanctionedWallets(walletAddresses: string[]): Promise<void> {
    const key = COLLECTION_KEYS.ofacSanctionsWallets;

    // - Add new addresses first
    // - Remove addresses that are no longer sanctioned
    const normalizedAddresses = walletAddresses.map((addr) =>
      addr.toLowerCase()
    );

    if (normalizedAddresses.length > 0) {
      await this.kv.sadd(key, ...normalizedAddresses);
    }

    try {
      const existing = await this.kv.smembers<string[]>(key);
      const newSet = new Set(normalizedAddresses);
      const toRemove = existing.filter((addr) => !newSet.has(addr));
      if (toRemove.length > 0) {
        await this.kv.srem(key, ...toRemove);
      }
    } catch {
      // noop
    }
  }

  async getSanctionsLastUpdate(): Promise<string | null> {
    const key = COLLECTION_KEYS.ofacSanctionsLastUpdate;
    return await this.kv.get<string>(key);
  }

  async setSanctionsLastUpdate(timestamp: string): Promise<void> {
    const key = COLLECTION_KEYS.ofacSanctionsLastUpdate;
    await this.kv.set(key, timestamp);
  }

  async addSanctionedWallets(walletAddresses: string[]): Promise<void> {
    const key = COLLECTION_KEYS.ofacSanctionsWallets;
    if (walletAddresses.length > 0) {
      const normalizedAddresses = walletAddresses.map((addr) =>
        addr.toLowerCase()
      );
      await this.kv.sadd(key, ...normalizedAddresses);
    }
  }

  async getSanctionedWalletsCount(): Promise<number> {
    const key = COLLECTION_KEYS.ofacSanctionsWallets;
    return await this.kv.scard(key);
  }

  async removeSanctionedWallets(walletAddresses: string[]): Promise<void> {
    const key = COLLECTION_KEYS.ofacSanctionsWallets;
    if (walletAddresses.length > 0) {
      const normalizedAddresses = walletAddresses.map((addr) =>
        addr.toLowerCase()
      );
      await this.kv.srem(key, ...normalizedAddresses);
    }
  }
}
