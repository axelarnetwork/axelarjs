import { type VercelKV } from "@vercel/kv";
import { z } from "zod";

import { hex40Literal, hex64Literal } from "~/lib/utils/schemas";

export type RemoteInterchainToken = {};

export const interchainTokenDetailsSchema = z.object({
  name: z.string(),
  symbol: z.string(),
  decimals: z.number(),
  address: hex40Literal(),
  deployerAddress: hex40Literal(),
  originChainId: z.number(),
  axelarChainId: z.string(),
  tokenId: hex64Literal(),
  salt: z.string(),
  deploymentTxHash: hex64Literal(),
  remoteTokens: z.array(
    z.object({
      axelarChainId: z.string(),
      address: hex40Literal(),
    })
  ),
});

export type IntercahinTokenDetails = z.infer<
  typeof interchainTokenDetailsSchema
>;

export const accountDetailsSchema = z.object({
  address: hex40Literal(),
  nonce: z.number(),
  interchainTokensIds: z.array(hex64Literal()),
});

export type AccountDetails = z.infer<typeof accountDetailsSchema>;

export const COLLECTIONS = {
  interchainTokens: "interchain-tokens",
  accounts: "accounts",
};

export const COLLECTION_KEYS = {
  interchainTokenDetails: (tokenAddress: `0x${string}`) =>
    `${COLLECTIONS.interchainTokens}/${tokenAddress}`,
  accountDetails: (accountAddress: `0x${string}`) =>
    `${COLLECTIONS.accounts}/${accountAddress}`,
};

export default class MaestroKVClient {
  constructor(private kv: VercelKV) {}

  async getInterchainTokenDetails(tokenAddress: `0x${string}`) {
    const key = COLLECTION_KEYS.interchainTokenDetails(tokenAddress);
    const val = await this.kv.get<IntercahinTokenDetails>(key);
    return val;
  }

  async hgetInterchainTokenDetails(
    tokenAddress: `0x${string}`,
    field: keyof IntercahinTokenDetails
  ) {
    const key = COLLECTION_KEYS.interchainTokenDetails(tokenAddress);
    const val = await this.kv.hget<IntercahinTokenDetails>(key, field);
    return val;
  }

  async setInterchainTokenDetails(
    tokenAddress: `0x${string}`,
    details: IntercahinTokenDetails
  ) {
    const key = COLLECTION_KEYS.interchainTokenDetails(tokenAddress);
    await this.kv.set(key, details);
  }

  async patchInterchainTokenDetials(
    tokenAddress: `0x${string}`,
    details: Partial<IntercahinTokenDetails>
  ) {
    const key = COLLECTION_KEYS.interchainTokenDetails(tokenAddress);
    const val = await this.kv.get<IntercahinTokenDetails>(key);
    const newVal = { ...val, ...details };
    await this.kv.set(key, newVal);
  }

  async getAccountDetails(accountAddress: `0x${string}`) {
    const key = COLLECTION_KEYS.accountDetails(accountAddress);
    const val = await this.kv.get<AccountDetails>(key);
    return val;
  }

  async hgetAccountDetails(
    accountAddress: `0x${string}`,
    field: keyof AccountDetails
  ) {
    const key = COLLECTION_KEYS.accountDetails(accountAddress);
    const val = await this.kv.hget<AccountDetails>(key, field);
    return val;
  }

  async setAccountDetails(
    accountAddress: `0x${string}`,
    details: AccountDetails
  ) {
    const key = COLLECTION_KEYS.accountDetails(accountAddress);
    await this.kv.set(key, details);
  }

  async patchAccountDetails(
    accountAddress: `0x${string}`,
    details: Partial<AccountDetails>
  ) {
    const key = COLLECTION_KEYS.accountDetails(accountAddress);
    const val = await this.kv.get<AccountDetails>(key);
    const newVal = { ...val, ...details };
    await this.kv.set(key, newVal);
  }
}
