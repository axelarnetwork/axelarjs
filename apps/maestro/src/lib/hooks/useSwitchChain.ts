import { useSwitchChain as useWagmiSwitchChain } from "wagmi";

import { NEXT_PUBLIC_NETWORK_ENV } from "~/config/env";
import { useChainId, useDisconnect } from "~/lib/hooks";

// TODO: fixing this once we have the sui chain data
const CHAIN_ID_SUI = NEXT_PUBLIC_NETWORK_ENV === "mainnet" ? 101 : 103;

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
