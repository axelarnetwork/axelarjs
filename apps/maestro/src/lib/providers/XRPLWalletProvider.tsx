import { invariant } from '@axelarjs/utils'
import { CrossmarkWallet } from '@axelarjs/xrpl-wallet-standard-vendored'
import { type XRPLBaseWallet } from '@axelarjs/xrpl-wallet-standard-vendored';
import { WalletConnectWallet } from '@axelarjs/xrpl-wallet-standard-vendored'
import { XamanWallet } from '@axelarjs/xrpl-wallet-standard-vendored'
import { WalletProvider as StandardWalletProvider } from '@axelarjs/xrpl-wallet-standard-vendored'
import { useMemo } from 'react'
import { xrplChainConfig } from '~/config/chains'

export default function WalletProvider({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const xrplWallets = useMemo(() => {
    const availableWallets: Array<XRPLBaseWallet> = [new CrossmarkWallet()];
    
    const walletConnectProjectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID;
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
    // this invariant captures that this needs to return at least one available wallet, otherwise the app will never load
    invariant(availableWallets.length > 0);

    return availableWallets;
  }, []);

  if (xrplWallets.length === 0) return null;

  return <StandardWalletProvider registerWallets={xrplWallets} autoConnect={true}>{children}</StandardWalletProvider>
}