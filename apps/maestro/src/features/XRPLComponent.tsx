'use client'
import { WalletProvider as StandardWalletProvider } from '@xrpl-wallet-standard/react'

export default function WalletProvider({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <StandardWalletProvider>{children}</StandardWalletProvider>
}
