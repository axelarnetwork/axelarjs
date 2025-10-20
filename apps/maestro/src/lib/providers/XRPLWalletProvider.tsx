import { invariant } from '@axelarjs/utils'
import { CrossmarkWallet } from '@xrpl-wallet-adapter/crossmark'
import { WalletConnectWallet } from '@xrpl-wallet-adapter/walletconnect'
import { XamanWallet } from '@xrpl-wallet-adapter/xaman'
import { WalletProvider as StandardWalletProvider } from '@xrpl-wallet-standard/react'
import { useMemo } from 'react'
import { xrplChainConfig } from '~/config/chains'

export default function WalletProvider({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const xrplWallets = useMemo(() => {
    let availableWallets: any[] = [new CrossmarkWallet()];
    
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

    invariant(availableWallets.length > 0);

    return availableWallets;
  }, []);

  if (xrplWallets.length === 0) return null;

  return <StandardWalletProvider registerWallets={xrplWallets} autoConnect={true}>{children}</StandardWalletProvider>
}