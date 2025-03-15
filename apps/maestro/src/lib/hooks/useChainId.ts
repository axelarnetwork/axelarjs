import { useMemo } from "react";

import { useCurrentAccount } from "@mysten/dapp-kit";
import { useChainId as useWagmiChainId } from "wagmi";

// Sui's chain ID
import { NEXT_PUBLIC_NETWORK_ENV } from "~/config/env";

export const SUI_CHAIN_ID = NEXT_PUBLIC_NETWORK_ENV === "mainnet" ? 101 : 103;
export const STELAR_CHAIN_ID = 110; // TODO: make it dynamic if necessary

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
