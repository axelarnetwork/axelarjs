import {
  AxelarConfigClient,
  AxelarConfigsResponse,
  ChainConfig,
} from "@axelarjs/api";

import { encodeAbiParameters, keccak256 } from "viem";

import MaestroKVClient from "~/services/db/kv";
import {
  ChainsMap,
  evmChains,
  EvmChainsValue,
  vmChains,
  VMChainsValue,
} from "./chainConfig";

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
