import { useDisconnectWallet } from "@mysten/dapp-kit";
import { useDisconnect as useWagmiDisconnect } from "wagmi";

import { setStellarConnectionState } from "../utils/stellar";
import { useWallet as useXRPLWallet, useDisconnect as useXRPLDisconnect } from "@xrpl-wallet-standard/react";

interface DisconnectResult {
  disconnect: () => void;
  error: Error | null;
}

export function useDisconnect(): DisconnectResult {
  const { disconnect: wagmiDisconnect, error: wagmiError } =
    useWagmiDisconnect();
  const { mutate: suiDisconnect } = useDisconnectWallet();
  const xrplDisconnect = useXRPLDisconnect();
  const xrpl = useXRPLWallet();
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

      // Attempt to disconnect from xrpl wallet
      if (xrpl.status === "connected") {
        xrplDisconnect().catch(err => {
          console.error("Failed to disconnect XRPL:", err); // we don't really care if that fails
        });
      }
    } catch (e) {
      error = e as Error;
    }
  };

  return {
    disconnect,
    error: error,
  };
}
