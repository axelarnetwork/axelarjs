'use client'

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
        useXRPLDisconnect();
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
