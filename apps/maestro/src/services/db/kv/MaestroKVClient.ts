import type { VercelKV } from "@vercel/kv";

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

export type MessageKind = "modal" | "banner";

export type Message = {
  messageKind: MessageKind;
  content: string;
  startTimestamp: string;
  endTimestamp: string;
};

export type Messages = {
  [key: string]: Message;
};

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

  async getMessages() {
    return await this.kv.hgetall<Messages>("messages");
  }

  async getAccountMessages(accountAddresss: `0x${string}`) {
    return await this.kv.hgetall<Messages>(`messages:${accountAddresss}`);
  }

  async setCached<T>(key: string, value: T, ttl = 3600) {
    await this.kv.set(`cached:${key}`, value, { ex: ttl });
  }

  async getCached<T>(key: string) {
    return await this.kv.get<T>(`cached:${key}`);
  }
}
