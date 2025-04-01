import {
  AxelarConfigClient,
  AxelarConfigsResponse,
  ChainConfig,
  EvmChainConfig,
  VMChainConfig,
} from "@axelarjs/api";
import { invariant } from "@axelarjs/utils";

import { encodeAbiParameters, keccak256 } from "viem";

import { CHAIN_CONFIGS, ExtendedWagmiChainConfig } from "~/config/chains";
import MaestroKVClient from "~/services/db/kv";

export type EvmChainsValue = {
  info: EvmChainConfig;
  wagmi: ExtendedWagmiChainConfig;
};

export type EVMChainsMap = Record<string | number, EvmChainsValue>;

export type VMChainsValue = {
  info: VMChainConfig;
  wagmi?: ExtendedWagmiChainConfig;
};

export type VMChainsMap = Record<string | number, VMChainsValue>;

export type ChainsMap = Record<string | number, EvmChainsValue | VMChainsValue>;

// Internal helper function to fetch, filter, and map chains by type
async function _getChainsMapByType<
  TCacheKey extends string,
  TChainType extends "evm" | "sui",
  TMap extends TChainType extends "evm" ? EVMChainsMap : VMChainsMap,
>(
  kvClient: MaestroKVClient,
  axelarConfigClient: AxelarConfigClient,
  cacheKey: TCacheKey,
  chainType: TChainType
): Promise<TMap> {
  if (process.env.DISABLE_CACHE !== "true") {
    const cached = await kvClient.getCached<TMap>(cacheKey);
    if (cached) {
      return cached;
    }
  }

  const axelarConfig = await axelarConfigClient.getAxelarConfigs();
  const chainKeys = Object.keys(axelarConfig.chains);
  const allChains = chainKeys.map((key) => axelarConfig.chains[key]);

  const configuredIDs = CHAIN_CONFIGS.map((chain) => chain.id);

  const eligibleChains = allChains.filter(
    (chain) =>
      chain.chainType === chainType &&
      configuredIDs.includes(chain.externalChainId)
  );

  const chainsMap = eligibleChains.reduce(
    (acc, chain) => {
      const wagmiConfig = CHAIN_CONFIGS.find(
        (config) => config.id === chain.externalChainId
      );

      // We handle the invariant check specifically in evmChains
      const entry = {
        info: chain,
        wagmi: wagmiConfig,
      };

      return {
        ...acc,
        [chain.id]: entry,
        [wagmiConfig?.id]: entry,
      }
    },
    {} as Record<string | number, EvmChainsValue | VMChainsValue>
  );

  // Cache for 1 hour
  // We cast to TMap here, assuming the filtering and mapping logic correctly produces the desired type.
  await kvClient.setCached<TMap>(cacheKey, chainsMap as TMap, 3600);

  return chainsMap as TMap;
}

export async function vmChains<TCacheKey extends string>(
  kvClient: MaestroKVClient,
  axelarConfigClient: AxelarConfigClient,
  cacheKey: TCacheKey
): Promise<VMChainsMap> {
  // Directly return the result from the helper function for VM chains
  return _getChainsMapByType(kvClient, axelarConfigClient, cacheKey, "vm");
}

export async function evmChains<TCacheKey extends string>(
  kvClient: MaestroKVClient,
  axelarConfigClient: AxelarConfigClient,
  cacheKey: TCacheKey
): Promise<EVMChainsMap> {
  const chainsMap = await _getChainsMapByType(
    kvClient,
    axelarConfigClient,
    cacheKey,
    "evm"
  );

  // Post-process to ensure wagmi config exists for EVM chains, satisfying the EVMChainsMap type
  const validatedMap: EVMChainsMap = {};
  for (const key in chainsMap) {
    const entry = chainsMap[key];
    // Assert that wagmi config is present for EVM chains
    invariant(
      entry.wagmi,
      `wagmiConfig is required for EVM chain ${entry.info.id}`
    );
    // If the invariant passes, we know entry matches EvmChainsValue structure
    validatedMap[key] = entry as EvmChainsValue;
  }

  return validatedMap;
}

export async function axelarConfigs<TCacheKey extends string>(
  kvClient: MaestroKVClient,
  axelarConfigClient: AxelarConfigClient,
  cacheKey: TCacheKey
): Promise<AxelarConfigsResponse> {
  if (process.env.DISABLE_CACHE !== "true") {
    const cached = await kvClient.getCached<AxelarConfigsResponse>(cacheKey);

    if (cached) {
      return cached;
    }
  }

  const chainConfigs = await axelarConfigClient.getAxelarConfigs();

  // cache for 1 hour
  await kvClient.setCached<AxelarConfigsResponse>(cacheKey, chainConfigs, 3600);

  return chainConfigs;
}

export async function axelarChainConfigs<TCacheKey extends string>(
  kvClient: MaestroKVClient,
  axelarConfigClient: AxelarConfigClient,
  cacheKey: TCacheKey
): Promise<Record<string, ChainConfig>> {
  type RedisType = Promise<Record<string, ChainConfig>>;
  if (process.env.DISABLE_CACHE !== "true") {
    const cached = await kvClient.getCached<RedisType>(cacheKey);

    if (cached) {
      return cached;
    }
  }

  const chainConfigs = await axelarConfigClient.getAxelarConfigs();
  const chains = chainConfigs.chains;

  // cache for 1 hour
  await kvClient.setCached<Awaited<RedisType>>(cacheKey, chains, 3600);

  return chains;
}

// Calculate PREFIX_INTERCHAIN_TOKEN_SALT
const PREFIX_INTERCHAIN_TOKEN_SALT = keccak256(
  Buffer.from(process.env.INTERCHAIN_TOKEN_SALT || "its-interchain-token-salt")
);

export function generateInterchainTokenSalt(
  tokenId: `0x${string}`
): `0x${string}` {
  if (!tokenId.startsWith("0x") || tokenId.length !== 66) {
    throw new Error("tokenId must be a valid bytes32 hex string");
  }

  // Use the keccak256 hash function from the js-sha3 library
  const buffer = encodeAbiParameters(
    [
      { name: "y", type: "bytes32" },
      { name: "z", type: "bytes32" },
    ],
    [PREFIX_INTERCHAIN_TOKEN_SALT, keccak256(tokenId)]
  );

  // Create a keccak256 hash of the buffer
  const hash = keccak256(buffer);

  return `${hash}`;
}

export async function chains<TCacheKey extends string>(
  kvClient: MaestroKVClient,
  axelarConfigClient: AxelarConfigClient, // Changed from axelarscanClient
  cacheKey: TCacheKey
): Promise<ChainsMap> {
  if (process.env.DISABLE_CACHE !== "true") {
    const cached = await kvClient.getCached<ChainsMap>(cacheKey);

    if (cached) {
      return cached;
    }
  }

  // Both evmChains and vmChains now use axelarConfigClient
  const [evmChainsMap, vmChainsMap] = await Promise.all([
    evmChains(kvClient, axelarConfigClient, `${cacheKey}-evm`),
    vmChains(kvClient, axelarConfigClient, `${cacheKey}-vm`),
  ]);

  const combinedChainsMap: Record<string, EvmChainsValue | VMChainsValue> = {};

  for (const chain of Object.values(evmChainsMap)) {
    combinedChainsMap[chain.info.id] = chain;
    combinedChainsMap[chain.info.chain_id] = chain;
  }

  for (const chain of Object.values(vmChainsMap)) {
    combinedChainsMap[chain.info.id] = chain;
    combinedChainsMap[chain.info.chain_id] = chain;
  }

  // cache for 1 hour
  await kvClient.setCached(cacheKey, combinedChainsMap, 3600);

  return combinedChainsMap;
}
