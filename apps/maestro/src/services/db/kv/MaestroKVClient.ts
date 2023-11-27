import type { VercelKV } from "@vercel/kv";

export const COLLECTIONS = {
  accounts: "accounts",
} as const;

export type AccountStatus = "enabled" | "limited" | "disabled";

export const COLLECTION_KEYS = {
  accountNonce: (accountAddress: `0x${string}`) =>
    `${COLLECTIONS.accounts}:${accountAddress}:nonce` as const,
  accountStatus: (accountAddress: `0x${string}`) =>
    `${COLLECTIONS.accounts}:${accountAddress}:status` as const,
};

export class BaseMaestroKVClient {
  constructor(protected kv: VercelKV) {}
}

export default class MaestroKVClient extends BaseMaestroKVClient {
  async createAccount(accountAddress: `0x${string}`) {
    await this.kv.set(COLLECTION_KEYS.accountNonce(accountAddress), 0);
  }

  async getAccountNonce(accountAddress: `0x${string}`) {
    const key = COLLECTION_KEYS.accountNonce(accountAddress);
    const nonce = await this.kv.get<number>(key);

    return nonce;
  }

  async incrementAccountNonce(accountAddress: `0x${string}`) {
    return await this.kv.incr(COLLECTION_KEYS.accountNonce(accountAddress));
  }

  async getAccountStatus(accountAddress: `0x${string}`) {
    const key = COLLECTION_KEYS.accountStatus(accountAddress);
    const status = await this.kv.get<AccountStatus>(key);

    return status;
  }

  async setCached<T>(key: string, value: T, ttl = 3600) {
    await this.kv.set(`cached:${key}`, value, { ex: ttl });
  }

  async getCached<T>(key: string) {
    return await this.kv.get<T>(`cached:${key}`);
  }
}
