import { useSwitchChain as useWagmiSwitchChain } from "wagmi";

import {
  solanaChainConfig,
  stellarChainConfig,
  suiChainConfig,
} from "~/config/chains";
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
      const isCurrentChainSolana = currentChainId === solanaChainConfig?.id;
      const isTargetChainSolana = chainId === solanaChainConfig?.id;
      const evmToEvm =
        !isTargetChainSui &&
        !isCurrentChainSui &&
        !isCurrentChainStellar &&
        !isTargetChainStellar &&
        !isCurrentChainSolana &&
        !isTargetChainSolana;
      if (evmToEvm) {
        switchChainWagmi({ chainId });
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
