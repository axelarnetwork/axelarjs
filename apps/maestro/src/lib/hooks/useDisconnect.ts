import { useDisconnectWallet } from "@mysten/dapp-kit";
import { useWallet as useSolanaWallet } from "@solana/wallet-adapter-react";
import { useDisconnect as useWagmiDisconnect } from "wagmi";

import { setStellarConnectionState } from "../utils/stellar";

interface DisconnectResult {
  disconnect: () => void;
  error: Error | null;
}

export function useDisconnect(): DisconnectResult {
  const { disconnect: wagmiDisconnect, error: wagmiError } =
    useWagmiDisconnect();
  const { mutate: suiDisconnect } = useDisconnectWallet();
  const solana = useSolanaWallet();
  let error: Error | null = wagmiError;

  const disconnect = () => {
    try {
      // Attempt to disconnect from Wagmi (EVM) wallet
      if (wagmiDisconnect) {
        wagmiDisconnect();
      }

      // There is no way to disconnect from Freighter so we handle it manually
      setStellarConnectionState(false);

      // Attempt to disconnect from SUI wallet
      suiDisconnect();

      // Attempt to disconnect from Solana wallet
      if (solana?.connected) {
        solana.disconnect().catch((e) => {
          throw new Error("[Disconnect] Solana disconnect error", e?.message);
        });
      }
    } catch (e) {
      error = e as Error;
      console.error("[Disconnect] Error", error?.message);
    }
  };

  return {
    disconnect,
    error: error,
  };
}
