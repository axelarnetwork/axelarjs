import { useSwitchChain as useWagmiSwitchChain } from "wagmi";

import { suiChainConfig } from "~/config/chains";
import { useChainId, useDisconnect } from "~/lib/hooks";
import useConnectWallet from "./useConnectWallet";

export function useSwitchChain() {
  const { switchChain: switchChainWagmi } = useWagmiSwitchChain();
  const { disconnect } = useDisconnect();
  const currentChainId = useChainId();
  const connectWallet = useConnectWallet();

  async function switchChain({ chainId }: { chainId: number }) {
    if (chainId) {
      const isTargetChainSui = chainId === suiChainConfig.id;
      const isCurrentChainSui = currentChainId === suiChainConfig.id;
      const evmToEvm = !isTargetChainSui && !isCurrentChainSui;
      if (evmToEvm) {
        switchChainWagmi({ chainId });
      } else if (chainId) {
        disconnect();
        await connectWallet({ chainId });
      }
    }
  }

  return {
    switchChain,
  };
}

export default useSwitchChain;
