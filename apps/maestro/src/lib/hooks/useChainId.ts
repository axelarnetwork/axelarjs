import { useMemo } from "react";

import { useCurrentAccount } from "@mysten/dapp-kit";
import { useWallet as useSolanaWallet } from "@solana/wallet-adapter-react";
import { useWallet as useXRPLWallet } from "@xrpl-wallet-standard/react";
import { useChainId as useWagmiChainId } from "wagmi";

import {
  SOLANA_CHAIN_ID,
  STELLAR_CHAIN_ID,
  SUI_CHAIN_ID,
  XRPL_CHAIN_ID,
} from "~/config/chains";
import { getStellarConnectionState } from "~/lib/utils/stellar";
import { useAccount } from "./useAccount";

// TODO: check if this is the best way to use chain ids, maybe we should combine it with chain type
export function useChainId(): number {
  const wagmiChainId = useWagmiChainId();
  const suiAccount = useCurrentAccount();
  const { chain } = useAccount();
  const solanaWallet = useSolanaWallet();
  const XRPLWallet = useXRPLWallet();

  const chainId = useMemo(() => {
    // Check if Stellar wallet is connected
    if (chain?.id === STELLAR_CHAIN_ID) {
      return STELLAR_CHAIN_ID;
    }
    // Check if Solana wallet is connected
    if (chain?.id === SOLANA_CHAIN_ID) {
      return SOLANA_CHAIN_ID;
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

    // Check if Solana wallet is connected
    if (solanaWallet.connected && solanaWallet.publicKey) {
      return SOLANA_CHAIN_ID;
    }

    if (
      XRPLWallet.status === "connected" &&
      XRPLWallet.wallet?.accounts.length
    ) {
      return XRPL_CHAIN_ID;
    }

    return wagmiChainId;
  }, [wagmiChainId, suiAccount, chain, solanaWallet, XRPLWallet]);

  return chainId;
}
