import { useLocalStorageState } from "@axelarjs/utils/react/usePersistedState";
import { useEffect } from "react";
import { useSession } from "next-auth/react";

import {
  useConnectWallet as useSuiConnectWallet,
  useWallets,
} from "@mysten/dapp-kit";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useSwitchChain as useWagmiSwitchChain } from "wagmi";

import { suiChainConfig } from "~/config/chains";
import { isValidEVMAddress } from "../utils/validation";

export function useConnectWallet() {
  const wallets = useWallets();
  const { mutate: connect } = useSuiConnectWallet();
  const { open: openWeb3Modal } = useWeb3Modal();

  const { data: sessionData } = useSession();
  const { switchChain: switchChainWagmi } = useWagmiSwitchChain();

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

  const tryConnectSuiWallet = () => {
    for (const wallet of wallets) {
      try {
        // Attempt to connect to each wallet
        connect({ wallet });
        return true;
      } catch (error) {
        continue;
      }
    }
    return false;
  };

  const connectWallet = ({ chainId }: { chainId: number }) => {
    const isTargetChainSui = chainId === suiChainConfig.id;

    if (isTargetChainSui) {
      return tryConnectSuiWallet();
    } else {
      setPendingChainId(chainId);
      void openWeb3Modal();
      return true;
    }
  };

  return connectWallet;
}

export default useConnectWallet;
