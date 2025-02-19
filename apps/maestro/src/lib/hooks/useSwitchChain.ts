import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

import { useConnectWallet, useWallets } from "@mysten/dapp-kit";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useSwitchChain as useWagmiSwitchChain } from "wagmi";

import { NEXT_PUBLIC_NETWORK_ENV } from "~/config/env";
import { useChainId, useDisconnect } from "~/lib/hooks";
import { isValidEVMAddress } from "../utils/validation";

// TODO: fixing this once we have the sui chain data
const CHAIN_ID_SUI = NEXT_PUBLIC_NETWORK_ENV === "mainnet" ? 101 : 103;

export function useSwitchChain() {
  const { switchChain: switchChainWagmi } = useWagmiSwitchChain();
  const { disconnect } = useDisconnect();
  const currentChainId = useChainId();
  const wallets = useWallets();
  const { mutate: connect } = useConnectWallet();
  const { open: openWeb3Modal } = useWeb3Modal();
  const { data: sessionData } = useSession();
  const [pendingChainId, setPendingChainId] = useState<number | null>(null);

  useEffect(() => {
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
    const isTargetChainSui = chainId === CHAIN_ID_SUI;
    const isCurrentChainSui = currentChainId === CHAIN_ID_SUI;

    if (isTargetChainSui && !isCurrentChainSui) {
      disconnect();
      await tryConnectSuiWallet();
    } else if (!isTargetChainSui && isCurrentChainSui) {
      disconnect();
      setPendingChainId(chainId);
      await openWeb3Modal();
    } else if (!isTargetChainSui && !isCurrentChainSui && chainId) {
      switchChainWagmi({ chainId });
    }
  }

  return {
    switchChain,
    tryConnectSuiWallet,
  };
}

export default useSwitchChain;
