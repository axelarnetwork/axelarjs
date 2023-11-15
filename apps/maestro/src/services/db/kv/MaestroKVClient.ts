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
