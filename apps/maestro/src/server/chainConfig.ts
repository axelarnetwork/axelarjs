import {
  AxelarConfigClient,
  EvmChainConfig,
  VmChainConfig,
} from "@axelarjs/api";
import { invariant } from "@axelarjs/utils";

import { CHAIN_CONFIGS, ExtendedWagmiChainConfig } from "~/config/chains";
import MaestroKVClient from "~/services/db/kv";

/**
 * This chain config type is used for mapping the s3 chain config type into the type we've used across ITS Portal app to limit changes across the codebase.
 */
type ITSBaseChainConfig = {
  id: string;
  chain_id: number;
  name: string;
  image: string;
  chain_name: string;
  chain_type: string;
  native_token: {
    name: string;
    symbol: string;
    decimals: number;
    iconUrl?: string;
  };
};

// Picked types from original response (what we keep it as-is from the response)
type PICKED_TYPES = "config" | "blockExplorers";

// Map API response to our used fields
export type ITSEvmChainConfig = Pick<VmChainConfig, PICKED_TYPES> &
  ITSBaseChainConfig;

export type ITSVmChainConfig = Pick<VmChainConfig, PICKED_TYPES> &
  ITSBaseChainConfig;

export type ITSChainConfig = ITSEvmChainConfig | ITSVmChainConfig;

export type EvmChainsValue = {
  info: ITSEvmChainConfig;
  wagmi: ExtendedWagmiChainConfig;
};

export type VMChainsValue = {
  info: ITSVmChainConfig;
};

type ChainMapKey = string | number;

export type EVMChainsMap = Record<ChainMapKey, EvmChainsValue>;
export type VMChainsMap = Record<ChainMapKey, VMChainsValue>;
export type ChainsMap = Record<ChainMapKey, EvmChainsValue | VMChainsValue>;

/**
 * Creates an entry object for the chain map based on the chain type.
 *
 * @param chain The chain configuration object (EVM or VM).
 * @param wagmiConfig Optional Wagmi config (for EVM chains).
 * @param internalChainIdNumber Optional internal chain ID (for VM chains).
 * @returns The corresponding chain map entry (EvmChainsValue or VMChainsValue).
 */
function createChainMapEntry(
  chain: EvmChainConfig | VmChainConfig,
  wagmiConfig?: ExtendedWagmiChainConfig,
  internalChainIdNumber?: number
): EvmChainsValue | VMChainsValue {
  const baseInfo = {
    id: chain.id,
    name: chain.displayName,
    image: chain.iconUrl,
    native_token: chain.nativeCurrency,
    config: chain.config,
    chain_name: chain.id,
    chain_type: chain.chainType,
  };

  if (chain.chainType === "evm") {
    const evmChain = chain as EvmChainConfig;
    return {
      info: {
        ...baseInfo,
        chain_id: parseInt(evmChain.externalChainId),
      },
      wagmi: wagmiConfig, // wagmiConfig should be provided for EVM
    } as EvmChainsValue;
  } else {
    // Assume VM chain
    return {
      info: {
        ...baseInfo,
        chain_id: internalChainIdNumber, // internalChainIdNumber should be provided for VM
      },
    } as VMChainsValue;
  }
}

function getEvmChainMap(
  evmChains: EvmChainConfig[],
  configuredIDs: number[]
): EVMChainsMap {
  const eligibleChains = evmChains.filter((chain) =>
    configuredIDs.includes(parseInt(chain.externalChainId))
  );

  return eligibleChains.reduce((acc, chain) => {
    const wagmiConfig = CHAIN_CONFIGS.find(
      (config) => config.id === parseInt(chain.externalChainId)
    );

    // We handle the invariant check specifically in evmChains
    const entry = createChainMapEntry(chain, wagmiConfig);

    return {
      ...acc,
      [chain.id]: entry,
      [parseInt(chain.externalChainId)]: entry,
    } as EVMChainsMap;
  }, {});
}

function getVMChainMap(vmChains: VmChainConfig[]) {
  return vmChains.reduce((acc, chain) => {
    const internalChainIdNumber = CHAIN_CONFIGS.find(
      (config) => config.axelarChainId === chain.id
    )?.id;

    // We handle the invariant check specifically in evmChains function later
    const entry = createChainMapEntry(chain, undefined, internalChainIdNumber);

    // Only add entry if internalChainIdNumber was found
    if (internalChainIdNumber) {
      return {
        ...acc,
        [chain.id]: entry,
        [internalChainIdNumber]: entry,
      } as VMChainsMap;
    }

    // Skip adding the entry if internalChainIdNumber is not found
    return acc;
  }, {});
}

async function getAllChains(axelarConfigClient: AxelarConfigClient) {
  const axelarConfig = await axelarConfigClient.getAxelarConfigs();
  const chainKeys = Object.keys(axelarConfig.chains);
  return chainKeys
    .map((key) => axelarConfig.chains[key])
    .filter(
      (chain) =>
        chain.chainType !== "axelarnet" && (chain.config as any).contracts
    );
}

// Internal helper function to fetch, filter, and map EVM chains
async function getEvmChainsMapInternal<TCacheKey extends string>(
  kvClient: MaestroKVClient,
  axelarConfigClient: AxelarConfigClient,
  cacheKey: TCacheKey
): Promise<EVMChainsMap> {
  if (process.env.DISABLE_CACHE !== "true") {
    const cached = await kvClient.getCached<EVMChainsMap>(cacheKey);
    if (cached) {
      return cached;
    }
  }

  const allChains = await getAllChains(axelarConfigClient);

  const configuredIDs = CHAIN_CONFIGS.map((chain) => chain.id);

  const eligibleChains = allChains.filter((chain) => chain.chainType === "evm");

  const chainsMap = getEvmChainMap(
    eligibleChains as EvmChainConfig[],
    configuredIDs
  );
  await kvClient.setCached<EVMChainsMap>(cacheKey, chainsMap, 3600);

  return chainsMap;
}

// Internal helper function to fetch, filter, and map VM chains
async function getVmChainsMapInternal<TCacheKey extends string>(
  kvClient: MaestroKVClient,
  axelarConfigClient: AxelarConfigClient,
  cacheKey: TCacheKey
): Promise<VMChainsMap> {
  if (process.env.DISABLE_CACHE !== "true") {
    const cached = await kvClient.getCached<VMChainsMap>(cacheKey);
    if (cached) {
      return cached;
    }
  }

  const allChains = await getAllChains(axelarConfigClient);

  const eligibleChains = allChains.filter(
    (chain) => !["evm"].includes(chain.chainType)
  );

  const chainsMap = getVMChainMap(eligibleChains as VmChainConfig[]);
  await kvClient.setCached<VMChainsMap>(cacheKey, chainsMap, 3600);
  return chainsMap;
}

export async function vmChains<TCacheKey extends string>(
  kvClient: MaestroKVClient,
  axelarConfigClient: AxelarConfigClient,
  cacheKey: TCacheKey
): Promise<VMChainsMap> {
  return getVmChainsMapInternal(kvClient, axelarConfigClient, cacheKey);
}

export async function evmChains<TCacheKey extends string>(
  kvClient: MaestroKVClient,
  axelarConfigClient: AxelarConfigClient,
  cacheKey: TCacheKey
): Promise<EVMChainsMap> {
  const chainsMap = await getEvmChainsMapInternal(
    kvClient,
    axelarConfigClient,
    cacheKey
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
    validatedMap[key] = entry;
  }

  return validatedMap;
}
