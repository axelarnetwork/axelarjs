import { ITSChainConfig } from "@axelarjs/api";

export const filterEligibleChains = (
  chains: ITSChainConfig[],
  currentChainId: number,
  whitelistedChains: string[]
): ITSChainConfig[] => {
  // Early return if no chains to filter
  if (!chains.length) return [];

  // Normalize whitelist check
  const isAllChainsWhitelisted = whitelistedChains[0] === 'all';

  return chains.filter((chain) => {
    // Always filter out current chain
    if (chain.chain_id === currentChainId) return false;

    // For EVM chains, check whitelist
    if (chain.chain_type === 'evm') {
      return isAllChainsWhitelisted || whitelistedChains.includes(chain.id);
    }

    // Non-EVM chains are always included
    return true;
  });
};
