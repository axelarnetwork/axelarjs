import { useMemo, type FC, type PropsWithChildren } from "react";

import { type XRPLBaseWallet } from "@xrpl-wallet-adapter/base";
import { CrossmarkWallet } from "@xrpl-wallet-adapter/crossmark";
import { WalletConnectWallet } from "@xrpl-wallet-adapter/walletconnect";
import { XamanWallet } from "@xrpl-wallet-adapter/xaman";
import { MetaMaskWallet } from './eip6963/MetaMaskEIP6963Wallet';
import { useMetaMaskProvider } from './eip6963/eip6963';
import { WalletProvider as StandardWalletProvider } from "@xrpl-wallet-standard/react";

import { xrplChainConfig } from "~/config/chains";

export const XrplWalletProvider: FC<PropsWithChildren> = ({ children }) => {
  // xrpl - with EIP-6963 support for MetaMask
  const metamaskProvider = useMetaMaskProvider();

  const xrplWallets = useMemo(() => {
    // Avoid constructing wallets during SSR
    if (typeof window === "undefined") {
      return [] as Array<XRPLBaseWallet>;
    }

    const availableWallets: Array<XRPLBaseWallet> = [new CrossmarkWallet()];

    console.log(metamaskProvider);

    if(metamaskProvider) {
      availableWallets.push(new MetaMaskWallet(metamaskProvider));
    }

    const walletConnectProjectId =
      process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID;
    if (walletConnectProjectId && walletConnectProjectId.length > 0) {
      const walletConnectWallet = new WalletConnectWallet({
        projectId: walletConnectProjectId,
        networks: [(xrplChainConfig as any).xrplNetwork],
        desktopWallets: [],
        mobileWallets: [],
      });

      availableWallets.push(walletConnectWallet);
    }

    const xamanApiKey = process.env.NEXT_PUBLIC_XAMAN_API_KEY;
    if (xamanApiKey && xamanApiKey.length > 0) {
      const xamanWallet = new XamanWallet(xamanApiKey);

      availableWallets.push(xamanWallet);
    }

    return availableWallets;
  }, [metamaskProvider]);

  // If wallets are not available (SSR/disabled), just render children
  if (xrplWallets.length === 0) return <>{children}</>;

  return (
    <StandardWalletProvider registerWallets={xrplWallets} autoConnect={true}>
      {children}
    </StandardWalletProvider>
  );
};
