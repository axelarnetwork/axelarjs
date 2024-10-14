import { useMemo } from "react";

import { useCurrentAccount } from "@mysten/dapp-kit";
import { useChainId as useWagmiChainId } from "wagmi";

// Sui's chain ID
const SUI_CHAIN_ID = 101;

// TODO: check if this is the best way to use chain ids, maybe we should combine it with chain type
export function useChainId(): number {
  const wagmiChainId = useWagmiChainId();
  const suiAccount = useCurrentAccount();

  const chainId = useMemo(() => {
    if (suiAccount) {
      return SUI_CHAIN_ID;
    }
    return wagmiChainId;
  }, [wagmiChainId, suiAccount]);

  return chainId;
}
