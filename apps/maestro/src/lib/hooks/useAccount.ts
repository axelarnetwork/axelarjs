import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";

import { useCurrentAccount as useMystenAccount } from "@mysten/dapp-kit";
import { getAddress, isAllowed, isConnected } from "@stellar/freighter-api";
import type { Chain } from "viem";
import { useAccount as useWagmiAccount } from "wagmi";

import { stellar, suiChainConfig } from "~/config/chains/vm-chains";
import { NEXT_PUBLIC_NETWORK_ENV } from "~/config/env";
import { useEVMChainConfigsQuery } from "../../services/axelarscan/hooks";

interface CombinedAccountInfo {
  address: `0x${string}`;
  isConnected: boolean;
  isDisconnected: boolean;
  chain?: Chain;
  isEvmChain: boolean;
  chainName?: string;
  isWrongSuiNetwork?: boolean;
}

export function useAccount(): CombinedAccountInfo {
  const wagmiAccount = useWagmiAccount();
  const mystenAccount = useMystenAccount();
  const { data: evmChains } = useEVMChainConfigsQuery();
  const APP_SUI_NETWORK =
    NEXT_PUBLIC_NETWORK_ENV === "mainnet" ? "sui:mainnet" : "sui:testnet";
  const [stellarAccount, setStellarAccount] = useState<string | null>(null);
  const { data: session } = useSession();

  // Check if session has a Stellar address
  useEffect(() => {
    console.log("[Stellar] Checking session for Stellar address");
    if (
      session?.address &&
      session.address.startsWith("G") &&
      session.address.length === 56
    ) {
      console.log(
        "[Stellar] Found Stellar address in session:",
        session.address
      );
      getAddress()
        .then((x) => {
          console.log("[Stellar] Got address from wallet:", x);
          setStellarAccount(x?.address);
        })
        .catch((e) => {
          console.log("[Stellar] Error getting address:", e);
        });
    }
  }, [session?.address]);

  // Use Freighter SDK to check for connected account
  useEffect(() => {
    // Skip if we already have a Stellar address from session
    if (stellarAccount) {
      console.log(
        "[Stellar] Already have Stellar address from session, skipping Freighter check"
      );
      return;
    }

    // Check if Freighter is available and connected
    const checkFreighterStatus = async () => {
      try {
        // First check if Freighter is allowed to connect to this site
        const allowed = await isAllowed();
        console.log("[Stellar] Freighter allowed:", allowed);

        // Check if connected without triggering connection
        const connected = await isConnected();
        console.log("[Stellar] Freighter connected:", connected);

        if (connected) {
          // Get public key without triggering connection
          const publicKey = await getAddress();
          console.log("[Stellar] Freighter public key:", publicKey);
          setStellarAccount(publicKey.address);
        } else {
          setStellarAccount(null);
        }
      } catch (error) {
        console.log("[Stellar] Error checking Freighter status:", error);
        setStellarAccount(null);
      }
    };

    // Check once when component mounts
    void checkFreighterStatus();

    // Also listen for Freighter account changes
    const handleAccountChange = () => {
      console.log("[Stellar] Freighter account changed");
      void checkFreighterStatus();
    };

    // Add event listener if available
    if (typeof window !== "undefined") {
      window.addEventListener("freighter:accountChanged", handleAccountChange);
    }

    // Clean up
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener(
          "freighter:accountChanged",
          handleAccountChange
        );
      }
    };
  }, [stellarAccount]);

  const isWagmiConnected = wagmiAccount.isConnected;
  const isMystenConnected = !!mystenAccount;
  const isStellarConnected = !!stellarAccount;

  const evmChain = useMemo(
    () => evmChains?.find?.((x) => x.chain_id === wagmiAccount?.chain?.id),
    [wagmiAccount?.chain, evmChains]
  );

  return {
    address:
      wagmiAccount.address ||
      (mystenAccount?.address as `0x${string}`) ||
      (stellarAccount as string),
    isConnected: isWagmiConnected || isMystenConnected || isStellarConnected,
    isDisconnected:
      !isWagmiConnected && !isMystenConnected && !isStellarConnected,
    chain:
      wagmiAccount.chain ||
      (isMystenConnected && suiChainConfig) ||
      (isStellarConnected && stellar) ||
      undefined,
    isEvmChain: !!evmChain,
    chainName:
      evmChain?.chain_name ||
      (isMystenConnected && "Sui") ||
      (isStellarConnected && "Stellar") ||
      undefined,
    isWrongSuiNetwork:
      isMystenConnected && mystenAccount?.chains[0] !== APP_SUI_NETWORK,
  };
}
