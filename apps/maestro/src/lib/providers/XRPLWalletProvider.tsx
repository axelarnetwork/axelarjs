import { useMemo, type FC, type PropsWithChildren } from "react";

import { type XRPLBaseWallet } from "@xrpl-wallet-adapter/base";
import { CrossmarkWallet } from "@xrpl-wallet-adapter/crossmark";
import { WalletConnectWallet } from "@xrpl-wallet-adapter/walletconnect";
import { XamanWallet } from "@xrpl-wallet-adapter/xaman";
import { WalletProvider as StandardWalletProvider } from "@xrpl-wallet-standard/react";

import { xrplChainConfig } from "~/config/chains";

export const XrplWalletProvider: FC<PropsWithChildren> = ({ children }) => {
  const xrplWallets = useMemo(() => {
    // Avoid constructing wallets during SSR
    if (typeof window === "undefined") {
      return [] as Array<XRPLBaseWallet>;
    }

    const availableWallets: Array<XRPLBaseWallet> = [new CrossmarkWallet()];

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
  }, []);

  // If wallets are not available (SSR/disabled), just render children
  if (xrplWallets.length === 0) return <>{children}</>;

  return (
    <StandardWalletProvider registerWallets={xrplWallets} autoConnect={true}>
      {children}
    </StandardWalletProvider>
  );
};
