import { useCallback, useEffect, useMemo, useState } from "react";

import { useCurrentAccount as useMystenAccount } from "@mysten/dapp-kit";
import {
  useConnection,
  useWallet as useSolanaWallet,
} from "@solana/wallet-adapter-react";
import { clusterApiUrl } from "@solana/web3.js";
import { getAddress, getNetwork, isConnected } from "@stellar/freighter-api";
import type { Chain } from "viem";
import { useAccount as useWagmiAccount } from "wagmi";

import {
  solanaChainConfig,
  stellarChainConfig,
  suiChainConfig,
} from "~/config/chains/vm-chains";
import { NEXT_PUBLIC_NETWORK_ENV } from "~/config/env";
import {
  getStellarConnectionState,
  STELLAR_CONNECTION_CHANGE,
} from "~/lib/utils/stellar";
import { useEVMChainConfigsQuery } from "~/services/axelarConfigs/hooks";

// Custom event for stellar wallet connection changes
export { STELLAR_CONNECTION_CHANGE };

interface CombinedAccountInfo {
  address: `0x${string}`;
  isConnected: boolean;
  isDisconnected: boolean;
  chain?: Chain;
  isEvmChain: boolean;
  chainName?: string;
  isWrongSuiNetwork?: boolean;
  isWrongSolanaNetwork?: boolean;
  isWrongStellarNetwork?: boolean;
  isLoadingStellar?: boolean;
}

export function useAccount(): CombinedAccountInfo {
  const wagmiAccount = useWagmiAccount();
  const mystenAccount = useMystenAccount();
  const solanaWallet = useSolanaWallet();
  const { connection: solanaConnection } = useConnection();
  const [stellarAccount, setStellarAccount] = useState<string | null>(null);
  const [stellarNetwork, setStellarNetwork] = useState<string | null>(null);
  const [isLoadingStellar, setIsLoadingStellar] = useState(true);

  const { data: evmChains } = useEVMChainConfigsQuery();
  const APP_SUI_NETWORK =
    NEXT_PUBLIC_NETWORK_ENV === "mainnet" ? "sui:mainnet" : "sui:testnet";
  const APP_SOLANA_CLUSTER =
    NEXT_PUBLIC_NETWORK_ENV === "mainnet"
      ? "mainnet-beta"
      : NEXT_PUBLIC_NETWORK_ENV === "devnet-amplifier"
        ? "devnet"
        : "testnet";
  const APP_STELLAR_NETWORK =
    NEXT_PUBLIC_NETWORK_ENV === "mainnet" ? "PUBLIC" : "TESTNET";
  const checkFreighterStatus = useCallback(async () => {
    const isStellarConnected = getStellarConnectionState() ?? false;
    if (stellarAccount && isStellarConnected) {
      setIsLoadingStellar(false);
      return;
    }

    if (!isStellarConnected) {
      setStellarAccount(null);
      setIsLoadingStellar(false);
      return;
    }

    // Get the stellar account and network if stellar is connected
    setIsLoadingStellar(true);
    try {
      const connected = await isConnected();
      if (connected) {
        const publicKey = await getAddress();
        setStellarAccount(publicKey.address);
        const network = await getNetwork();
        setStellarNetwork(network.network);
      } else {
        setStellarAccount(null);
      }
    } catch (error) {
      console.error("[Stellar] Error checking Freighter status:", error);
      setStellarAccount(null);
    } finally {
      setIsLoadingStellar(false);
    }
  }, [stellarAccount, setStellarAccount]);

  useEffect(() => {
    // Initial check
    void checkFreighterStatus();

    const handleStorageChange = () => {
      void checkFreighterStatus();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener(STELLAR_CONNECTION_CHANGE, handleStorageChange);
  }, [checkFreighterStatus]);

  const isWagmiConnected = wagmiAccount.isConnected;
  const isMystenConnected = !!mystenAccount;
  const isSolanaConnected = !!solanaWallet.publicKey;
  const isStellarConnected = !!stellarAccount;

  const evmChain = useMemo(
    () => evmChains?.find?.((x) => x.chain_id === wagmiAccount?.chain?.id),
    [wagmiAccount?.chain, evmChains]
  );

  return {
    address:
      wagmiAccount.address ||
      (mystenAccount?.address as `0x${string}`) ||
      (solanaWallet.publicKey?.toBase58() as unknown as `0x${string}`) ||
      (stellarAccount as string),
    isConnected:
      isWagmiConnected ||
      isMystenConnected ||
      isSolanaConnected ||
      isStellarConnected,
    isDisconnected:
      !isWagmiConnected &&
      !isMystenConnected &&
      !isSolanaConnected &&
      !isStellarConnected,
    chain:
      wagmiAccount.chain ||
      (isMystenConnected && suiChainConfig) ||
      (isSolanaConnected && solanaChainConfig) ||
      (isStellarConnected && stellarChainConfig) ||
      undefined,
    isEvmChain: !!evmChain,
    chainName:
      evmChain?.chain_name ||
      (isMystenConnected && "Sui") ||
      (isSolanaConnected && solanaChainConfig.name) ||
      (isStellarConnected && "Stellar") ||
      undefined,
    isWrongSuiNetwork:
      isMystenConnected && mystenAccount?.chains[0] !== APP_SUI_NETWORK,
    isWrongSolanaNetwork:
      isSolanaConnected &&
      !!solanaConnection &&
      solanaConnection.rpcEndpoint !== clusterApiUrl(APP_SOLANA_CLUSTER),
    isWrongStellarNetwork:
      isStellarConnected &&
      !!stellarNetwork &&
      APP_STELLAR_NETWORK !== stellarNetwork,
    isLoadingStellar,
  };
}
