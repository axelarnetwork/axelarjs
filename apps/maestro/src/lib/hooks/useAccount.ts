import { useMemo } from "react";

import { useCurrentAccount as useMystenAccount } from "@mysten/dapp-kit";
import type { Chain } from "viem";
import { useAccount as useWagmiAccount } from "wagmi";

import { suiChainConfig } from "~/config/chains/vm-chains";
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

  const isWagmiConnected = wagmiAccount.isConnected;
  const isMystenConnected = !!mystenAccount;

  const evmChain = useMemo(
    () => evmChains?.find?.((x) => x.chain_id === wagmiAccount?.chain?.id),
    [wagmiAccount?.chain, evmChains]
  );

  return {
    address: wagmiAccount.address || (mystenAccount?.address as `0x${string}`),
    isConnected: isWagmiConnected || isMystenConnected,
    isDisconnected: !isWagmiConnected && !isMystenConnected,
    chain:
      wagmiAccount.chain || (isMystenConnected && suiChainConfig) || undefined,
    isEvmChain: !!evmChain,
    chainName:
      evmChain?.chain_name || (isMystenConnected && "Sui") || undefined,
    isWrongSuiNetwork:
      isMystenConnected && mystenAccount?.chains[0] !== APP_SUI_NETWORK,
  };
}
