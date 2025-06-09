import { useDisconnectWallet } from "@mysten/dapp-kit";
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
    } catch (e) {
      error = e as Error;
    }
  };

  return {
    disconnect,
    error: error,
  };
}
