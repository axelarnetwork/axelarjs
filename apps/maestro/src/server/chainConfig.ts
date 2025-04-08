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
function mapToITSChainValue(
  chain: EvmChainConfig | VmChainConfig,
  wagmiConfig?: ExtendedWagmiChainConfig,
  internalChainIdNumber?: number
): EvmChainsValue | VMChainsValue {
  const {
    id,
    displayName,
    config,
    iconUrl,
    nativeCurrency,
    chainType,
    blockExplorers,
  } = chain;
  const baseInfo = {
    id,
    chain_id: 0, // Placeholder, will be overwritten below
    name: displayName,
    image: iconUrl,
    native_token: nativeCurrency,
    chain_name: id,
    chain_type: chainType,
  };

  const commonData = {
    config,
    blockExplorers, // Add blockExplorers if needed, adjust type if VM can have it
  };

  if (chain.chainType === "evm") {
    const evmChain = chain as EvmChainConfig;
    return {
      info: {
        ...baseInfo,
        ...commonData,
        chain_id: parseInt(evmChain.externalChainId),
      },
      wagmi: wagmiConfig, // wagmiConfig must be provided for EVM
    } as EvmChainsValue;
  } else {
    // Assume VM chain
    return {
      info: {
        ...baseInfo,
        ...commonData,
        chain_id: internalChainIdNumber as number, // internalChainIdNumber must be provided for VM
      },
    } as VMChainsValue;
  }
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

  const eligibleEvmChains = allChains.filter(
    (chain): chain is EvmChainConfig =>
      chain.chainType === "evm" &&
      configuredIDs.includes(parseInt(chain.externalChainId))
  );

  const chainsMap = eligibleEvmChains.reduce<EVMChainsMap>((acc, chain) => {
    const wagmiConfig = CHAIN_CONFIGS.find(
      (config) => config.id === parseInt(chain.externalChainId)
    );

    // invariant check happens in the public `evmChains` function
    if (wagmiConfig) {
      const entry = mapToITSChainValue(chain, wagmiConfig) as EvmChainsValue; // Cast needed because mapToITSChainValue can return VM type theoretically

      acc[chain.id] = entry;
      acc[parseInt(chain.externalChainId)] = entry;
    }
    // If wagmiConfig is not found, the chain is skipped, matching previous behavior implicitly

    return acc;
  }, {});

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

  const eligibleVmChains = allChains.filter(
    (chain): chain is VmChainConfig => chain.chainType !== "evm" // Assuming anything not EVM is VM for ITS purposes
  );

  const chainsMap = eligibleVmChains.reduce<VMChainsMap>((acc, chain) => {
    const internalChainIdNumber = CHAIN_CONFIGS.find(
      (config) => config.axelarChainId === chain.id
    )?.id;

    // Only add entry if internalChainIdNumber was found
    if (internalChainIdNumber !== undefined) {
      const entry = mapToITSChainValue(
        chain,
        undefined,
        internalChainIdNumber
      ) as VMChainsValue; // Cast needed because mapToITSChainValue can return EVM type theoretically

      acc[chain.id] = entry;
      acc[internalChainIdNumber] = entry;
    }
    // If internalChainIdNumber is not found, the chain is skipped

    return acc;
  }, {});

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

  // Post-process invariant check: Ensure wagmi config exists for all returned EVM chains.
  // This check is crucial because the internal function might skip chains if wagmiConfig isn't found,
  // but the public function guarantees that all *returned* chains have it.
  Object.values(chainsMap).forEach((entry) => {
    invariant(
      entry.wagmi,
      `Invariant Violation: wagmiConfig is missing for EVM chain ${entry.info.id}. This should not happen if the chain is included in the final map.`
    );
  });

  return chainsMap;
}
