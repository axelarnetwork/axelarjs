import { useSwitchChain as useWagmiSwitchChain } from "wagmi";

import { useChainId, useDisconnect } from "~/lib/hooks";

const CHAIN_ID_SUI = 101;

export function useSwitchChain() {
  const { switchChain: switchChainWagmi } = useWagmiSwitchChain();
  const { disconnect } = useDisconnect();
  const currentChainId = useChainId();

  function switchChain({ chainId }: { chainId: number }) {
    const isTargetChainSui = chainId === CHAIN_ID_SUI;
    const isCurrentChainSui = currentChainId === CHAIN_ID_SUI;

    if (isTargetChainSui && !isCurrentChainSui) {
      disconnect();
    } else if (!isTargetChainSui && isCurrentChainSui) {
      disconnect();
      switchChainWagmi({ chainId });
    } else if (!isTargetChainSui && !isCurrentChainSui) {
      switchChainWagmi({ chainId });
    }
  }
  return {
    switchChain,
  };
}

export default useSwitchChain;
