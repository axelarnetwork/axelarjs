import { useMemo } from "react";

import { useCurrentAccount } from "@mysten/dapp-kit";
import { useWallet as useXRPLWallet } from "@axelarjs/xrpl-wallet-standard-vendored";
import { useChainId as useWagmiChainId } from "wagmi";

import { STELLAR_CHAIN_ID, SUI_CHAIN_ID, XRPL_CHAIN_ID } from "~/config/chains";
import { getStellarConnectionState } from "~/lib/utils/stellar";
import { useAccount } from "./useAccount";

// TODO: check if this is the best way to use chain ids, maybe we should combine it with chain type
export function useChainId(): number {
  const wagmiChainId = useWagmiChainId();
  const suiAccount = useCurrentAccount();
  const { chain } = useAccount();
  const XRPLWallet = useXRPLWallet();

  const chainId = useMemo(() => {
    // Check if Stellar wallet is connected
    if (chain?.id === STELLAR_CHAIN_ID) {
      // this saves us from having to listen to the storage event but we could find a better way
      return STELLAR_CHAIN_ID;
    }
    if (chain?.id === XRPL_CHAIN_ID) {
      return XRPL_CHAIN_ID;
    }

    const isStellarConnected = getStellarConnectionState() ?? false;
    if (isStellarConnected) {
      return STELLAR_CHAIN_ID;
    }
    if (suiAccount) {
      return SUI_CHAIN_ID;
    }

    // Check if XRPL wallet is connected // TODO: why?
    if (
      XRPLWallet.status === "connected" &&
      (XRPLWallet.wallet?.accounts.length ?? -1 > 0)
    ) {
      return XRPL_CHAIN_ID;
    }

    return wagmiChainId;
  }, [wagmiChainId, suiAccount, chain, XRPLWallet]);

  return chainId;
}
