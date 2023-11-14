import type { VercelKV } from "@vercel/kv";

export const COLLECTIONS = {
  accounts: "accounts",
} as const;

export const COLLECTION_KEYS = {
  accountNonce: (accountAddress: `0x${string}`) =>
    `${COLLECTIONS.accounts}:${accountAddress}:nonce` as const,
};

export class BaseMaestroKVClient {
  constructor(protected kv: VercelKV) {}

  /**
   * getter helper that migrates legacy string record to hash record
   *
   * @param key
   */
  protected async getMigrateStringToHash<T extends Record<string, unknown>>(
    key: string
  ) {
    return this.kv.hgetall<T>(key).catch(async () => {
      // check current key & migrate
      const value = await this.kv.get<T>(key);

      if (value) {
        // replace current key
        await this.kv.del(key);
        await this.kv.hset(key, value);
        return value;
      }

      return null;
    });
  }

  /**
   * getter helper that migrates legacy string record to set record
   *
   * @param key
   */
  protected async getMigrateStringToSet<T extends unknown[]>(key: string) {
    return this.kv.smembers<T>(key).catch(async () => {
      // check current key & migrate
      const value = await this.kv.get<T>(key);

      if (value) {
        // replace current key
        await this.kv.del(key);
        await this.kv.sadd(key, ...value);
        return value;
      }

      return null;
    });
  }
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
}
