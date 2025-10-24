'use client'
import { WalletProvider as StandardWalletProvider } from '@axelarjs/xrpl-wallet-standard-vendored'

export default function WalletProvider({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <StandardWalletProvider>{children}</StandardWalletProvider>
}
