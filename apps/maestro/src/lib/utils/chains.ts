import { ITSChainConfig } from "@axelarjs/api";
import { NEXT_PUBLIC_WHITELISTED_DEST_CHAINS_FOR_VM } from "~/config/env";

export const filterEligibleChains = (
  chains: ITSChainConfig[],
  currentChainId: number,
): ITSChainConfig[] => {
  // Early return if no chains to filter
  if (!chains.length) return [];

  const currentChain = chains.find((chain) => chain.chain_id === currentChainId);
  const isCurrentChainVM = currentChain?.chain_type === 'vm';

  const whitelistedChains = NEXT_PUBLIC_WHITELISTED_DEST_CHAINS_FOR_VM.split(',').map(chain => chain.trim());

  // Normalize whitelist check
  const isAllChainsWhitelisted = whitelistedChains[0] === 'all';

  return chains.filter((chain) => {
    // Always filter out current chain
    if (chain.chain_id === currentChainId) return false;

    // For EVM chains, check whitelist
    if (isCurrentChainVM && chain.chain_type === 'evm') {
      return isAllChainsWhitelisted || whitelistedChains.includes(chain.id);
    }

    // Non-EVM chains are always included
    return true;
  });
};
