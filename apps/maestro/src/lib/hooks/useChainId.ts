import { useMemo } from "react";

import { useCurrentAccount } from "@mysten/dapp-kit";
import { useWallet as useSolanaWallet } from "@solana/wallet-adapter-react";
import { useChainId as useWagmiChainId } from "wagmi";

// Sui's chain ID
import { NEXT_PUBLIC_NETWORK_ENV } from "~/config/env";
import { getStellarConnectionState } from "~/lib/utils/stellar";
import { useAccount } from "./useAccount";

export const SUI_CHAIN_ID = NEXT_PUBLIC_NETWORK_ENV === "mainnet" ? 101 : 103;
export const STELLAR_CHAIN_ID =
  NEXT_PUBLIC_NETWORK_ENV === "mainnet" ? 109 : 110;
export const SOLANA_CHAIN_ID =
  NEXT_PUBLIC_NETWORK_ENV === "mainnet"
    ? 111
    : NEXT_PUBLIC_NETWORK_ENV === "devnet-amplifier"
      ? 113
      : 112;

// TODO: check if this is the best way to use chain ids, maybe we should combine it with chain type
export function useChainId(): number {
  const wagmiChainId = useWagmiChainId();
  const suiAccount = useCurrentAccount();
  const { chain } = useAccount();
  const solanaWallet = useSolanaWallet();

  const chainId = useMemo(() => {
    // Check if Stellar wallet is connected
    if (chain?.id === STELLAR_CHAIN_ID) {
      return STELLAR_CHAIN_ID;
    }
    // Check if Solana wallet is connected
    if (chain?.id === SOLANA_CHAIN_ID) {
      return SOLANA_CHAIN_ID;
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

    return wagmiChainId;
  }, [wagmiChainId, suiAccount, chain, solanaWallet]);

  return chainId;
}
