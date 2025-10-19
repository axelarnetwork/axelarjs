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
  const xrplWallets = useMemo(() => [
      new CrossmarkWallet(),
      new WalletConnectWallet({
        projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID ?? '',
        networks: [(xrplChainConfig as any).xrplNetwork],
        desktopWallets: [],
        mobileWallets: [],
      }),
      new XamanWallet('a9bf63cf-6798-4eef-bc6f-50ea5d2818b2'),
    ], []);

  if (xrplWallets.length === 0) return null

  return <StandardWalletProvider registerWallets={xrplWallets} autoConnect={true}>{children}</StandardWalletProvider>
}