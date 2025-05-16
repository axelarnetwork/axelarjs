import { useMemo } from "react";

import { useCurrentAccount } from "@mysten/dapp-kit";
import { useChainId as useWagmiChainId } from "wagmi";

// Sui's chain ID
import { NEXT_PUBLIC_NETWORK_ENV } from "~/config/env";
import { getStellarConnectionState } from "~/lib/utils/stellar";
import { useAccount } from "./useAccount";

export const SUI_CHAIN_ID = NEXT_PUBLIC_NETWORK_ENV === "mainnet" ? 101 : 103;
export const STELLAR_CHAIN_ID =
  NEXT_PUBLIC_NETWORK_ENV === "mainnet" ? 109 : 110;

// TODO: check if this is the best way to use chain ids, maybe we should combine it with chain type
export function useChainId(): number {
  const wagmiChainId = useWagmiChainId();
  const suiAccount = useCurrentAccount();
  const { chain } = useAccount();

  const chainId = useMemo(() => {
    // Check if Stellar wallet is connected
    if (chain?.id === STELLAR_CHAIN_ID) {
      // this saves us from having to listen to the storage event but we could find a better way
      return STELLAR_CHAIN_ID;
    }
    const isStellarConnected = getStellarConnectionState() ?? false;
    if (isStellarConnected) {
      return STELLAR_CHAIN_ID;
    }
    if (suiAccount) {
      return SUI_CHAIN_ID;
    }
    return wagmiChainId;
  }, [wagmiChainId, suiAccount, chain]);

  return chainId;
}
