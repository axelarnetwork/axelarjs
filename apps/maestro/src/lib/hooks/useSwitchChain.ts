import { useSwitchChain as useWagmiSwitchChain } from "wagmi";

import { 
  getSwitchChainEthParamWithRpc,
  stellarChainConfig, 
  suiChainConfig,
  xrplChainConfig,
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
      const isCurrentChainXRPL = currentChainId === xrplChainConfig.id;
      const isTargetChainXRPL = chainId === xrplChainConfig.id;
      
      const evmToEvm =
        !isTargetChainSui &&
        !isCurrentChainSui &&
        !isCurrentChainStellar &&
        !isTargetChainStellar &&
        !isCurrentChainXRPL &&
        !isTargetChainXRPL;
      if (evmToEvm) {
        switchChainWagmi({
          chainId,
          addEthereumChainParameter: getSwitchChainEthParamWithRpc(chainId),
        });
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
