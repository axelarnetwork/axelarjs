import {
  AxelarConfigClient,
  EvmChainConfig,
  VmChainConfig,
} from "@axelarjs/api";
import { invariant } from "@axelarjs/utils";

import { CHAIN_CONFIGS, ExtendedWagmiChainConfig } from "~/config/chains";
import MaestroKVClient from "~/services/db/kv";

type ITSBaseChainConfig = {
  id: string;
  chain_id?: number;
  name: string;
  image: string;
  native_token: {
    name: string;
    symbol: string;
    decimals: number;
    iconUrl?: string;
  };
};

export type ITSEvmChainConfig = Omit<
  VmChainConfig,
  "iconUrl" | "displayName" | "nativeCurrency" | "externalChainId"
> &
  ITSBaseChainConfig;

// Mapping with our existing used fields name
export type ITSVmChainConfig = Omit<
  VmChainConfig,
  "iconUrl" | "displayName" | "nativeCurrency" | "externalChainId"
> &
  ITSBaseChainConfig;

export type EvmChainsValue = {
  info: ITSEvmChainConfig;
  wagmi: ExtendedWagmiChainConfig;
};

export type VMChainsValue = {
  info: ITSVmChainConfig;
};

export type EVMChainsMap = Record<string | number, EvmChainsValue>;
export type VMChainsMap = Record<string | number, VMChainsValue>;

export type ChainsMap = Record<string | number, EvmChainsValue | VMChainsValue>;

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

    // We handle the invariant check specifically in evmChains
    const entry = createChainMapEntry(chain, undefined, internalChainIdNumber);

    return {
      ...acc,
      [chain.id]: entry,
      [internalChainIdNumber as number]: entry,
    } as VMChainsMap;
  }, {});
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

  const axelarConfig = await axelarConfigClient.getAxelarConfigs();
  const chainKeys = Object.keys(axelarConfig.chains);
  const allChains = chainKeys.map((key) => axelarConfig.chains[key]);

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

  const axelarConfig = await axelarConfigClient.getAxelarConfigs();
  const chainKeys = Object.keys(axelarConfig.chains);
  const allChains = chainKeys.map((key) => axelarConfig.chains[key]);

  const eligibleChains = allChains.filter(
    (chain) => !["evm", "axelarnet"].includes(chain.chainType)
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
    validatedMap[key] = entry as EvmChainsValue;
  }

  return validatedMap;
}
