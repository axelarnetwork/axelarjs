import { invariant } from "@axelarjs/utils";
import { useMemo } from "react";

import { type XRPLBaseWallet } from "@xrpl-wallet-adapter/base";
import { CrossmarkWallet } from "@xrpl-wallet-adapter/crossmark";
import { XamanWallet } from "@xrpl-wallet-adapter/xaman";
import { WalletProvider as StandardWalletProvider } from "@xrpl-wallet-standard/react";

import { xrplChainConfig } from "~/config/chains";

// Dynamically import WalletConnect to handle ESM issues
let WalletConnectWallet: any = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const walletConnectModule = require("@xrpl-wallet-adapter/walletconnect");
  WalletConnectWallet = walletConnectModule.WalletConnectWallet;
} catch (error) {
  console.warn("WalletConnect wallet adapter not available:", error);
}

export default function WalletProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const xrplWallets = useMemo(() => {
    const availableWallets: Array<XRPLBaseWallet> = [new CrossmarkWallet()];

    const walletConnectProjectId =
      process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID;
    if (
      walletConnectProjectId &&
      walletConnectProjectId.length > 0 &&
      WalletConnectWallet
    ) {
      try {
        const walletConnectWallet = new WalletConnectWallet({
          projectId: walletConnectProjectId,
          networks: [(xrplChainConfig as any).xrplNetwork],
          desktopWallets: [],
          mobileWallets: [],
        });

        availableWallets.push(walletConnectWallet);
      } catch (error) {
        console.warn("Failed to initialize WalletConnect wallet:", error);
      }
    }

    const xamanApiKey = process.env.NEXT_PUBLIC_XAMAN_API_KEY;
    if (xamanApiKey && xamanApiKey.length > 0) {
      const xamanWallet = new XamanWallet(xamanApiKey);

      availableWallets.push(xamanWallet);
    }
    // this invariant captures that this needs to return at least one available wallet, otherwise the app will never load
    invariant(availableWallets.length > 0);

    return availableWallets;
  }, []);

  if (xrplWallets.length === 0) return null;

  return (
    <StandardWalletProvider registerWallets={xrplWallets} autoConnect={true}>
      {children}
    </StandardWalletProvider>
  );
}
