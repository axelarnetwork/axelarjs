import { type VercelKV } from "@vercel/kv";
import { uniq } from "rambda";
import { z } from "zod";

import { hex40Literal, hex64Literal } from "~/lib/utils/schemas";

export const remoteInterchainTokenSchema = z.object({
  chainId: z.number(),
  axelarChainId: z.string(),
  address: hex40Literal(),
  status: z.enum(["deployed", "pending"]),
  deplymentTxHash: hex64Literal(),
  deploymentLogIndex: z.number().optional(),
});

export type RemoteInterchainTokenDetails = z.infer<
  typeof remoteInterchainTokenSchema
>;

const interchainTokenKindSchema = z.union([
  z.object({
    kind: z.literal("standardized"),
    // only applicable to standardized tokens
    salt: hex64Literal(),
  }),
  z.object({
    kind: z.literal("canonical"),
  }),
]);

export const interchainTokenDetailsSchema = interchainTokenKindSchema.and(
  z.object({
    tokenName: z.string(),
    tokenSymbol: z.string(),
    tokenDecimals: z.number(),
    tokenAddress: hex40Literal(),
    deployerAddress: hex40Literal(),
    originChainId: z.number(),
    originAxelarChainId: z.string(),
    tokenId: hex64Literal(),
    deploymentTxHash: hex64Literal(),
    remoteTokens: z.array(remoteInterchainTokenSchema),
  })
);

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
} as const;

export const COLLECTION_KEYS = {
  interchainTokenDetails: (chainId: number, tokenAddress: `0x${string}`) =>
    `${COLLECTIONS.interchainTokens}/${chainId}/${tokenAddress}` as const,

  accountDetails: (accountAddress: `0x${string}`) =>
    `${COLLECTIONS.accounts}/${accountAddress}` as const,
};

export default class MaestroKVClient {
  constructor(private kv: VercelKV) {}

  async getInterchainTokenDetails(variables: {
    chainId: number;
    tokenAddress: `0x${string}`;
  }) {
    const key = COLLECTION_KEYS.interchainTokenDetails(
      variables.chainId,
      variables.tokenAddress
    );
    return this.kv.get<IntercahinTokenDetails>(key);
  }

  async hgetInterchainTokenDetails(
    variables: {
      chainId: number;
      tokenAddress: `0x${string}`;
    },
    field: keyof IntercahinTokenDetails
  ) {
    const key = COLLECTION_KEYS.interchainTokenDetails(
      variables.chainId,
      variables.tokenAddress
    );
    return this.kv.hget<IntercahinTokenDetails>(key, field);
  }

  async setInterchainTokenDetails(
    variables: {
      chainId: number;
      tokenAddress: `0x${string}`;
    },
    details: IntercahinTokenDetails
  ) {
    const key = COLLECTION_KEYS.interchainTokenDetails(
      variables.chainId,
      variables.tokenAddress
    );
    return this.kv.set(key, details);
  }

  async patchInterchainTokenDetials(
    variables: {
      chainId: number;
      tokenAddress: `0x${string}`;
    },
    details:
      | Partial<IntercahinTokenDetails>
      | ((
          details: IntercahinTokenDetails | null
        ) => Partial<IntercahinTokenDetails>)
  ) {
    const key = COLLECTION_KEYS.interchainTokenDetails(
      variables.chainId,
      variables.tokenAddress
    );
    const value = await this.kv.get<IntercahinTokenDetails>(key);

    const nextDetails =
      typeof details === "function" ? details(value) : details;

    await this.kv.set(key, { ...value, ...nextDetails });
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
    details:
      | Partial<AccountDetails>
      | ((details: AccountDetails | null) => Partial<AccountDetails>)
  ) {
    const key = COLLECTION_KEYS.accountDetails(accountAddress);
    const value = await this.kv.get<AccountDetails>(key);

    const nextDetetails =
      typeof details === "function" ? details(value) : details;

    await this.kv.set(key, { ...value, ...nextDetetails });
  }

  /// convenience methods

  async recordInterchainTokenDeployment(
    variables: {
      chainId: number;
      tokenAddress: `0x${string}`;
    },
    details: IntercahinTokenDetails
  ) {
    // prevent overwriting existing details
    const existingDetails = await this.getInterchainTokenDetails(variables);

    if (existingDetails) {
      throw new Error(
        `Interchain token details already exist for chainId: ${variables.chainId} and tokenAddress: ${variables.tokenAddress}`
      );
    }

    await this.setInterchainTokenDetails(variables, details);

    await this.patchAccountDetails(details.deployerAddress, (accountDetails) =>
      accountDetails
        ? {
            address: details.deployerAddress,
            nonce: accountDetails.nonce + 1,
            interchainTokensIds: uniq([
              ...accountDetails.interchainTokensIds,
              details.tokenId,
            ]),
          }
        : {
            address: details.deployerAddress,
            nonce: 1,
            interchainTokensIds: [details.tokenId],
          }
    );
  }

  async recordRemoteTokensDeployment(
    variables: {
      chainId: number;
      tokenAddress: `0x${string}`;
    },
    remoteTokens: RemoteInterchainTokenDetails[]
  ) {
    await this.patchInterchainTokenDetials(variables, (details) => {
      const patchedRemoteTokens = details
        ? [
            ...details.remoteTokens.map((existingRemoteToken) => {
              // is there a patch for this chainId?
              const remoteTokenPatch = remoteTokens.find(
                (x) => x.chainId === existingRemoteToken.chainId
              );

              return !remoteTokenPatch
                ? existingRemoteToken
                : {
                    ...existingRemoteToken,
                    ...remoteTokenPatch,
                  };
            }),
          ]
        : [];

      const existingChainIds = details
        ? details.remoteTokens.map((x) => x.chainId)
        : [];

      const addedRemoteTokens = remoteTokens.filter(
        (x) => !existingChainIds.includes(x.chainId)
      );

      const nextRemoteTokens = addedRemoteTokens.length
        ? [...patchedRemoteTokens, ...addedRemoteTokens]
        : patchedRemoteTokens;

      return {
        ...details,
        remoteTokens: nextRemoteTokens,
      };
    });
  }
}
