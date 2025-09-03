import { ReactNode } from "react";

import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { useStandardWalletAdapters } from "@solana/wallet-standard-wallet-adapter-react";
import { clusterApiUrl } from "@solana/web3.js";

import { NEXT_PUBLIC_NETWORK_ENV } from "~/config/env";

export function SolanaWalletProvider({ children }: { children: ReactNode }) {
  const cluster =
    NEXT_PUBLIC_NETWORK_ENV === "mainnet"
      ? "mainnet-beta"
      : NEXT_PUBLIC_NETWORK_ENV === "devnet-amplifier"
        ? "devnet"
        : "testnet";
  const endpoint = clusterApiUrl(
    cluster as "devnet" | "testnet" | "mainnet-beta"
  );
  const wallets = useStandardWalletAdapters([]);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default SolanaWalletProvider;
