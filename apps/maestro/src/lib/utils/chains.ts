import {
  ITSChainConfig,
  type EVMChainConfig,
  type VMChainConfig,
} from "@axelarjs/api";

import { NEXT_PUBLIC_WHITELISTED_DEST_CHAINS_FOR_VM } from "~/config/env";

type ChainConfig = EVMChainConfig | VMChainConfig;

type ChainConfigIndex = {
  indexedById: Record<string, ChainConfig>;
  indexedByChainId: Record<number, ChainConfig>;
};

/**
 * Filters out destination chains that are not eligible for the current chain vm chain.
 * Currently, only VM chains are eligible for the current chain type.
 * @param destinationChains - The list of chains to filter.
 * @param currentChainId - The ID of the current chain.
 * @returns A filtered list of chains.
 */
export const filterEligibleChains = (
  destinationChains: ITSChainConfig[],
  currentChainId: number
): ITSChainConfig[] => {
  // Early return if no chains to filter
  if (!destinationChains.length) return [];

  const currentChain = destinationChains.find(
    (chain) => chain.chain_id === currentChainId
  ) as ChainConfig;

  if (!currentChain) return [];

  const whitelistedChains = NEXT_PUBLIC_WHITELISTED_DEST_CHAINS_FOR_VM;
  // Normalize whitelist check
  const isAllChainsWhitelisted = whitelistedChains[0] === "all";

  return destinationChains.filter((chain) => {
    const isOriginChainSameAsDestinationChain =
      chain.chain_id === currentChainId;
    const areDifferentChainTypes = chain.chain_type !== currentChain.chain_type;
    const isThisDestinationChainWhitelisted =
      isAllChainsWhitelisted || whitelistedChains.includes(chain.id);
    const isOriginChainWhitelisted =
      isAllChainsWhitelisted || whitelistedChains.includes(currentChain?.id);

    // Always filter out current chain
    if (isOriginChainSameAsDestinationChain) return false;
    // Whitelisted chains are always included
    if (isThisDestinationChainWhitelisted || isOriginChainWhitelisted)
      return true;
    // If the chain types are different and none are whitelisted, filter out the chain
    if (areDifferentChainTypes) return false;
    // Chains with the same chain type are always included
    return true;
  });
};

/**
 * Retrieves the chain configuration based on the provided Axelar chain ID.
 * Handles the special case where the axelarChainId is "axelar".
 */
export function getNormalizedTwoHopChainConfig(
  axelarChainId: string,
  combinedComputed: ChainConfigIndex,
  chainId: number
): ChainConfig {
  const { indexedById, indexedByChainId } = combinedComputed;

  if (axelarChainId !== "axelar") {
    return indexedById[axelarChainId];
  }

  // Workaround: When a 2-hop tx is submitted, the axelarChainId will be "axelar"
  // because no Axelar chain is configured in our API. Since we only use
  // id, name, and image, we can copy other properties from any other chain.
  return {
    ...indexedByChainId[chainId],
    id: "axelar",
    name: "Axelar",
    image: "/logos/chains/axelar.svg",
  };
}
