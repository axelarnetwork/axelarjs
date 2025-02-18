import {
  AxelarConfigClient,
  AxelarConfigsResponse,
  AxelarscanClient,
  EVMChainConfig,
  VMChainConfig,
} from "@axelarjs/api";
import { invariant } from "@axelarjs/utils";

import { encodeAbiParameters, keccak256 } from "viem";

import { NEXT_PUBLIC_NETWORK_ENV } from "~/config/env";
import { ExtendedWagmiChainConfig, CHAIN_CONFIGS } from "~/config/chains";
import MaestroKVClient from "~/services/db/kv";

export type EVMChainsMap = Record<
  string | number,
  {
    info: EVMChainConfig;
    wagmi: ExtendedWagmiChainConfig;
  }
>;

export type VMChainsMap = Record<
  string | number,
  {
    info: VMChainConfig;
    wagmi?: ExtendedWagmiChainConfig;
  }
>;

export async function vmChains<TCacheKey extends string>(
  kvClient: MaestroKVClient,
  axelarscanClient: AxelarscanClient,
  cacheKey: TCacheKey
): Promise<VMChainsMap> {
  if (process.env.DISABLE_CACHE !== "true") {
    const cached = await kvClient.getCached<VMChainsMap>(cacheKey);

    if (cached) {
      return cached;
    }
  }

  const chainConfigs = await axelarscanClient.getChainConfigs();

  // Add evm-compatible chains to the list of eligible chains
  const vmChainsMap = chainConfigs.vm.reduce(
    (acc, chain) => {
      const wagmiConfig = CHAIN_CONFIGS.find(
        (config) => config.id === chain.chain_id
      );

      const entry = {
        info: chain,
        wagmi: wagmiConfig,
      };

      return {
        ...acc,
        [chain.id]: entry,
        [chain.chain_id]: entry,
      };
    },
    {} as Record<
      string | number,
      {
        info: VMChainConfig;
        wagmi?: ExtendedWagmiChainConfig;
      }
    >
  );

  // cache for 1 hour
  await kvClient.setCached<VMChainsMap>(cacheKey, vmChainsMap, 3600);

  return vmChainsMap;
}
export async function evmChains<TCacheKey extends string>(
  kvClient: MaestroKVClient,
  axelarscanClient: AxelarscanClient,
  cacheKey: TCacheKey
): Promise<EVMChainsMap> {
  if (process.env.DISABLE_CACHE !== "true") {
    const cached = await kvClient.getCached<EVMChainsMap>(cacheKey);

    if (cached) {
      return cached;
    }
  }

  const chainConfigs = await axelarscanClient.getChainConfigs();

  const configuredIDs = CHAIN_CONFIGS.map((chain) => chain.id);

  const eligibleChains = chainConfigs.evm.filter((chain) =>
    configuredIDs.includes(chain.chain_id)
  );

  // Add flow config to the list of eligible chains
  const evmChainsMap = eligibleChains.reduce(
    (acc, chain) => {
      const wagmiConfig = CHAIN_CONFIGS.find(
        (config) => config.id === chain.chain_id
      );

      // for type safety
      invariant(wagmiConfig, "wagmiConfig is required");

      const entry = {
        info: chain,
        wagmi: wagmiConfig,
      };

      // TODO: remove this once we have ITS hub on testnet
      if (NEXT_PUBLIC_NETWORK_ENV === "devnet-amplifier") {
        entry.info.id = wagmiConfig.axelarChainId;
      }

      return {
        ...acc,
        [chain.id]: entry,
        [chain.chain_id]: entry,
      };
    },
    {} as Record<
      string | number,
      {
        info: EVMChainConfig;
        wagmi: ExtendedWagmiChainConfig;
      }
    >
  );

  // cache for 1 hour
  await kvClient.setCached<EVMChainsMap>(cacheKey, evmChainsMap, 3600);

  return evmChainsMap;
}

export async function axelarConfigs<TCacheKey extends string>(
  kvClient: MaestroKVClient,
  axelarConfigClient: AxelarConfigClient,
  cacheKey: TCacheKey
): Promise<AxelarConfigsResponse> {
  if (process.env.DISABLE_CACHE !== "true") {
    const cached = await kvClient.getCached<any>(cacheKey);

    if (cached) {
      return cached;
    }
  }

  const chainConfigs = await axelarConfigClient.getAxelarConfigs(
    NEXT_PUBLIC_NETWORK_ENV
  );

  // cache for 1 hour
  await kvClient.setCached<any>(cacheKey, chainConfigs, 3600);

  return chainConfigs;
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
