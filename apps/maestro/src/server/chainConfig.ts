import {
  AxelarConfigClient,
  EvmChainConfig,
  VmChainConfig,
} from "@axelarjs/api";
import { invariant } from "@axelarjs/utils";

import { CHAIN_CONFIGS, ExtendedWagmiChainConfig } from "~/config/chains";
import MaestroKVClient from "~/services/db/kv";

export type EvmChainsValue = {
  info: EvmChainConfig;
  wagmi: ExtendedWagmiChainConfig;
};

export type VMChainsValue = {
  info: VmChainConfig;
};

export type EVMChainsMap = Record<string | number, EvmChainsValue>;
export type VMChainsMap = Record<string | number, VMChainsValue>;

export type ChainsMap = Record<string | number, EvmChainsValue | VMChainsValue>;

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
    const entry = {
      info: chain,
      wagmi: wagmiConfig,
    };

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
    const entry = {
      info: {
        ...chain,
        externalChainId: internalChainIdNumber,
      },
    };

    return {
      ...acc,
      [chain.id]: entry,
      [internalChainIdNumber as number]: entry,
    } as VMChainsMap;
  }, {});
}

// Internal helper function to fetch, filter, and map chains by type
async function getChainsMapByType<
  TCacheKey extends string,
  TChainType extends "evm" | "vm",
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

  if (chainType === "evm") {
    const eligibleChains = allChains.filter(
      (chain) => chain.chainType === chainType
    );

    const chainsMap = getEvmChainMap(
      eligibleChains as EvmChainConfig[],
      configuredIDs
    );
    await kvClient.setCached<TMap>(cacheKey, chainsMap as TMap, 3600);

    return chainsMap as TMap;
  } else if (chainType === "vm") {
    const eligibleChains = allChains.filter(
      (chain) => !["evm", "axelarnet"].includes(chain.chainType)
    );

    const chainsMap = getVMChainMap(eligibleChains as VmChainConfig[]);
    await kvClient.setCached<TMap>(cacheKey, chainsMap as TMap, 3600);
    return chainsMap as TMap;
  }

  throw new Error(`Unsupported Chain Type: ${chainType}`);
}

export async function vmChains<TCacheKey extends string>(
  kvClient: MaestroKVClient,
  axelarConfigClient: AxelarConfigClient,
  cacheKey: TCacheKey
): Promise<VMChainsMap> {
  // Directly return the result from the helper function for VM chains
  return getChainsMapByType(kvClient, axelarConfigClient, cacheKey, "vm");
}

export async function evmChains<TCacheKey extends string>(
  kvClient: MaestroKVClient,
  axelarConfigClient: AxelarConfigClient,
  cacheKey: TCacheKey
): Promise<EVMChainsMap> {
  const chainsMap = await getChainsMapByType(
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
