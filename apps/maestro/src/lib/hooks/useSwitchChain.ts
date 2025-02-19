import { useLocalStorageState } from "@axelarjs/utils/react/usePersistedState";
import { useEffect } from "react";
import { useSession } from "next-auth/react";

import { useConnectWallet, useWallets } from "@mysten/dapp-kit";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useSwitchChain as useWagmiSwitchChain } from "wagmi";

import { suiChainConfig } from "~/config/chains";
import { useChainId, useDisconnect } from "~/lib/hooks";
import { isValidEVMAddress } from "../utils/validation";

export function useSwitchChain() {
  const { switchChain: switchChainWagmi } = useWagmiSwitchChain();
  const { disconnect } = useDisconnect();
  const currentChainId = useChainId();
  const wallets = useWallets();
  const { mutate: connect } = useConnectWallet();
  const { open: openWeb3Modal } = useWeb3Modal();
  const { data: sessionData } = useSession();
  const [pendingChainId, setPendingChainId] = useLocalStorageState<
    number | null
  >("@maestro/pending-chain-id", null);

  useEffect(() => {
    // wait until the user has connected their wallet and has a pending chain id before switching
    if (
      sessionData?.address.length &&
      isValidEVMAddress(sessionData?.address) &&
      pendingChainId
    ) {
      switchChainWagmi({ chainId: pendingChainId });
      setPendingChainId(null);
    }
  }, [sessionData, pendingChainId, switchChainWagmi, setPendingChainId]);

  const tryConnectSuiWallet = async () => {
    for (const wallet of wallets) {
      try {
        // Attempt to connect to each wallet
        await new Promise<void>((resolve, reject) => {
          connect(
            { wallet },
            {
              onSuccess: () => resolve(),
              onError: (error) => reject(error),
            }
          );
        });
        return true;
      } catch (error) {
        continue;
      }
    }
    return false;
  };

  async function switchChain({ chainId }: { chainId: number }) {
    const isTargetChainSui = chainId === suiChainConfig.id;
    const isCurrentChainSui = currentChainId === suiChainConfig.id;
    const evmToEvm = !isTargetChainSui && !isCurrentChainSui;
    const evmToSui = isTargetChainSui && !isCurrentChainSui;
    const suiToEvm = !isTargetChainSui && isCurrentChainSui;

    if (evmToSui) {
      // EVM to Sui
      disconnect();
      await tryConnectSuiWallet();
    } else if (suiToEvm) {
      // Sui to EVM
      disconnect();
      setPendingChainId(chainId);
      await openWeb3Modal();
    } else if (evmToEvm && chainId) {
      // EVM to EVM
      switchChainWagmi({ chainId });
    }
  }

  return {
    switchChain,
    tryConnectSuiWallet,
  };
}

export default useSwitchChain;
