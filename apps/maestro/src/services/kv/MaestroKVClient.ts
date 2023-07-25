import { type VercelKV } from "@vercel/kv";
import { uniqBy } from "rambda";
import { z } from "zod";

import { hex40Literal, hex64Literal } from "~/lib/utils/schemas";

export const remoteInterchainTokenSchema = z.object({
  chainId: z.number(),
  axelarChainId: z.string(),
  address: hex40Literal().nullable(),
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

export const interchainTokenDetailsBaseSchema = interchainTokenKindSchema.and(
  z.object({
    tokenName: z.string(),
    tokenSymbol: z.string(),
    tokenDecimals: z.number(),
    tokenAddress: hex40Literal(),
    originChainId: z.number(),
    originAxelarChainId: z.string(),
    tokenId: hex64Literal(),
    deploymentTxHash: hex64Literal(),
    remoteTokens: z.array(remoteInterchainTokenSchema),
  })
);

export const interchainTokenDetailsSchema =
  interchainTokenDetailsBaseSchema.and(
    z.object({
      deployerAddress: hex40Literal(),
    })
  );

export type IntercahinTokenDetails = z.infer<
  typeof interchainTokenDetailsSchema
>;

export const accountDeploymentSchema = z.object({
  chainId: z.number(),
  tokenAddress: hex40Literal(),
});

export type AccountDployment = z.infer<typeof accountDeploymentSchema>;

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

export const LEGACY_COLLECTION_KEYS = {
  interchainTokenDetails: (chainId: number, tokenAddress: `0x${string}`) =>
    `${COLLECTIONS.interchainTokens}/${chainId}/${tokenAddress}` as const,

  accountDetails: (accountAddress: `0x${string}`) =>
    `${COLLECTIONS.accounts}/${accountAddress}` as const,

  accountDeployments: (accountAddress: `0x${string}`) =>
    `${COLLECTIONS.accounts}/${accountAddress}` as const,
};

export const COLLECTION_KEYS = {
  interchainTokenDetails: (chainId: number, tokenAddress: `0x${string}`) =>
    `${COLLECTIONS.interchainTokens}:${tokenAddress}:${chainId}` as const,

  accountDetails: (accountAddress: `0x${string}`) =>
    `${COLLECTIONS.accounts}:${accountAddress}` as const,

  accountNonce: (accountAddress: `0x${string}`) =>
    `${COLLECTIONS.accounts}:${accountAddress}:nonce` as const,

  accountDeployments: (accountAddress: `0x${string}`) =>
    `${COLLECTIONS.accounts}:${accountAddress}:deployments` as const,
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

    const tokenDetails = await this.kv.get<IntercahinTokenDetails>(key);

    if (tokenDetails !== null) {
      return tokenDetails;
    }

    // check legacy key & migrate

    const legacyKey = LEGACY_COLLECTION_KEYS.interchainTokenDetails(
      variables.chainId,
      variables.tokenAddress
    );

    const legacyTokenDetails = await this.kv.get<IntercahinTokenDetails>(
      legacyKey
    );

    if (legacyTokenDetails) {
      await this.kv.set(key, legacyTokenDetails);
      return legacyTokenDetails;
    }
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

  private async getLegacyAccountDetails(accountAddress: `0x${string}`) {
    const legacyKey = LEGACY_COLLECTION_KEYS.accountDetails(accountAddress);
    return await this.kv.get<AccountDetails>(legacyKey);
  }

  async createAccount(accountAddress: `0x${string}`) {
    this.kv.set(COLLECTION_KEYS.accountNonce(accountAddress), 0);
    this.kv.set(COLLECTION_KEYS.accountDeployments(accountAddress), []);
  }

  async appendAccountDeployments(
    accountAddress: `0x${string}`,
    details: AccountDployment
  ) {
    const key = COLLECTION_KEYS.accountDeployments(accountAddress);
    const value = await this.kv.get<AccountDployment[]>(key);

    if (value === null) {
      return await this.kv.set(key, [details]);
    }

    await this.kv.set(
      key,
      uniqBy((x) => `${x.tokenAddress}:${x.chainId}`, [...value, details])
    );
  }

  async getAccountNonce(accountAddress: `0x${string}`) {
    const nonce = await this.kv.get<number>(
      COLLECTION_KEYS.accountNonce(accountAddress)
    );

    if (nonce !== null) {
      return nonce;
    }

    // check legacy key & migrate
    const legacyAccount = await this.getLegacyAccountDetails(accountAddress);

    if (legacyAccount) {
      await this.kv.set(
        COLLECTION_KEYS.accountNonce(accountAddress),
        legacyAccount.nonce
      );
      return legacyAccount.nonce;
    }

    return null;
  }

  async incrementAccountNonce(accountAddress: `0x${string}`) {
    return await this.kv.incr(COLLECTION_KEYS.accountNonce(accountAddress));
  }

  async getAccountDeployments(accountAddress: `0x${string}`) {
    const deployments = await this.kv.get<`0x${string}`[]>(
      COLLECTION_KEYS.accountDeployments(accountAddress)
    );

    if (deployments !== null) {
      return deployments;
    }

    // check legacy key & migrate
    const legacyAccount = await this.getLegacyAccountDetails(accountAddress);

    if (legacyAccount) {
      await this.kv.set(
        COLLECTION_KEYS.accountNonce(accountAddress),
        legacyAccount.nonce
      );
      return legacyAccount.nonce;
    }
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

    await this.appendAccountDeployments(details.deployerAddress, {
      chainId: variables.chainId,
      tokenAddress: variables.tokenAddress,
    });
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
