import { useMemo } from "react";

import { useCurrentAccount as useMystenAccount } from "@mysten/dapp-kit";
import type { Chain } from "viem";
import { useAccount as useWagmiAccount } from "wagmi";

import { useEVMChainConfigsQuery } from "../../services/axelarscan/hooks";

interface CombinedAccountInfo {
  address: `0x${string}`;
  isConnected: boolean;
  isDisconnected: boolean;
  chain?: Chain;
  isEvmChain: boolean;
  chainName?: string;
}

export function useAccount(): CombinedAccountInfo {
  const wagmiAccount = useWagmiAccount();
  const mystenAccount = useMystenAccount();

  const { data: evmChains } = useEVMChainConfigsQuery();

  const isWagmiConnected = wagmiAccount.isConnected;
  const isMystenConnected = !!mystenAccount;

  const evmChain = useMemo(
    () => evmChains?.find?.((x) => x.chain_id === wagmiAccount?.chain?.id),
    [wagmiAccount?.chain, evmChains]
  );

  // TODO: do it more generic
  return {
    address: wagmiAccount.address || (mystenAccount?.address as `0x${string}`),
    isConnected: isWagmiConnected || isMystenConnected,
    isDisconnected: !isWagmiConnected && !isMystenConnected,
    chain: wagmiAccount.chain || {
      id: 101,
      name: "Sui",
      nativeCurrency: {
        name: "SUI",
        symbol: "SUI",
        decimals: 9,
      },
      rpcUrls: {
        default: { http: ["https://sui-rpc.publicnode.com"] },
        public: { http: ["https://sui-rpc.publicnode.com"] },
      },
      blockExplorers: {
        default: {
          name: "Sui Explorer",
          url: "https://suiscan.xyz",
        },
      },
    },
    isEvmChain: !!evmChain,
    chainName: evmChain?.chain_name || "Sui",
  };
}