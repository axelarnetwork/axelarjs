import { useLocalStorageState } from "@axelarjs/utils/react/usePersistedState";
import { useEffect } from "react";
import { useSession } from "next-auth/react";

import {
  useConnectWallet as useSuiConnectWallet,
  useWallets,
} from "@mysten/dapp-kit";
import { isBrowser, setAllowed } from "@stellar/freighter-api";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useSwitchChain as useWagmiSwitchChain } from "wagmi";

import { suiChainConfig } from "~/config/chains";
import { isValidEVMAddress } from "../utils/validation";

type WalletHandler = (chainId: number) => void;

export function useConnectWallet() {
  const wallets = useWallets();
  const { mutateAsync: connectAsync } = useSuiConnectWallet();
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

  const tryConnectSuiWallet = async () => {
    for (const wallet of wallets) {
      try {
        // Attempt to connect to each wallet
        await connectAsync({ wallet });
        return true;
      } catch (error) {
        console.error(`Failed to connect to wallet:`, error);
        continue;
      }
    }
    return false;
  };

  const tryConnectStellarWallet = async () => {
    console.log("trying to connect to stellar wallet");
    if (!isBrowser) {
      console.error("Stellar wallet is not available in this environment");
      return false;
    }
    try {
      const a = await setAllowed();
      console.log("the result is", a);
      return true;
    } catch (error) {
      console.error(`Failed to connect to Stellar wallet:`, error);
      return false;
    }
  };

  const chainHandlers: Record<number, WalletHandler> = {
    [suiChainConfig.id]: () => tryConnectSuiWallet(),
    [102]: () => tryConnectStellarWallet(), // Stellar chain ID
  };

  const defaultHandler: WalletHandler = (chainId) => {
    setPendingChainId(chainId);
    openWeb3Modal().catch((error) => {
      console.error("Error opening Web3Modal", error);
    });
  };

  const connectWallet = ({ chainId }: { chainId: number }) => {
    const handler = chainHandlers[chainId] ?? defaultHandler;
    return handler(chainId);
  };

  return connectWallet;
}

export default useConnectWallet;
