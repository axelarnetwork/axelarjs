import { useSwitchChain as useWagmiSwitchChain } from "wagmi";

import { HEDERA_CHAIN_ID, HEDERA_WALLET_RPC, stellarChainConfig, suiChainConfig } from "~/config/chains";
import { useChainId, useDisconnect } from "~/lib/hooks";
import useConnectWallet from "./useConnectWallet";

export function useSwitchChain() {
  const { switchChain: switchChainWagmi } = useWagmiSwitchChain();
  const { disconnect } = useDisconnect();
  const currentChainId = useChainId();
  const connectWallet = useConnectWallet();

  function switchChain({ chainId }: { chainId: number }) {
    if (chainId) {
      const isTargetChainSui = chainId === suiChainConfig.id;
      const isCurrentChainSui = currentChainId === suiChainConfig.id;
      const isCurrentChainStellar = currentChainId === stellarChainConfig.id;
      const isTargetChainStellar = chainId === stellarChainConfig.id;
      const evmToEvm =
        !isTargetChainSui &&
        !isCurrentChainSui &&
        !isCurrentChainStellar &&
        !isTargetChainStellar;
      if (evmToEvm) {
        switchChainWagmi({ chainId, addEthereumChainParameter: chainId === HEDERA_CHAIN_ID ? {rpcUrls: [HEDERA_WALLET_RPC]} : undefined });
      } else if (chainId) {
        disconnect();
        connectWallet({ chainId });
      }
    }
  }

  return {
    switchChain,
  };
}

export default useSwitchChain;
