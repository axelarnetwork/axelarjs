import { CrossmarkWallet } from '@xrpl-wallet-adapter/crossmark'
import { LedgerWallet } from '@xrpl-wallet-adapter/ledger'
import { WalletConnectWallet } from '@xrpl-wallet-adapter/walletconnect'
import { XamanWallet } from '@xrpl-wallet-adapter/xaman'
import { WalletProvider as StandardWalletProvider } from '@xrpl-wallet-standard/react'
import { useEffect, useState } from 'react'

export default function WalletProvider({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [rendered, setRendered] = useState(false)
  const [xrplRegisterWallets, setXRPLlRegisterWallets] = useState(null)

  useEffect(() => {
    setRendered(true);
    console.log("Setting rendered to true");
  }, [])

  useEffect(() => {
    console.log("Effect called, rendered is", rendered);
    if (rendered) {
      setXRPLlRegisterWallets([
        new CrossmarkWallet(),
        new LedgerWallet(),
        new WalletConnectWallet({
          projectId: '85ad846d8aa771cd56c2bbbf30f7a183',
          metadata: {
            name: 'React App',
            description: 'React App for WalletConnect',
            url: 'https://walletconnect.com/',
            icons: ['https://avatars.githubusercontent.com/u/37784886'],
          },
          networks: ['xrpl:mainnet'],
          desktopWallets: [],
          mobileWallets: [],
        }),
        new XamanWallet('a9bf63cf-6798-4eef-bc6f-50ea5d2818b2'),
      ]);
      console.log("XRPL Wallets registered");
      console.log(xrplRegisterWallets);
    }
  }, [rendered, setXRPLlRegisterWallets])


  return <StandardWalletProvider registerWallets={xrplRegisterWallets}>{children}</StandardWalletProvider>
}