import { type XRPLWallet, getRegisterdXRPLWallets, registerWallet } from '../../app'
import type { ReactNode } from 'react'
import { useRef } from 'react'
import { WalletContext } from '../contexts/walletContext.js'
import { useAutoConnect } from '../hooks/useAutoConnect.js'
import { createWalletStore } from '../store'

export type WalletProviderProps = {
  preferredWallets?: string[]
  autoConnect?: boolean
  registerWallets?: XRPLWallet[]
  children: ReactNode
}

const isSSR = typeof window === 'undefined'

export function WalletProvider({ autoConnect = true, registerWallets, children }: WalletProviderProps) {
  if (!isSSR && registerWallets)
    registerWallets
      .filter((wallet) => !getRegisterdXRPLWallets().find((rw) => rw.name === wallet.name))
      .forEach((wallet) => {
        registerWallet(wallet)
      })

  const storeRef = useRef(
    !isSSR
      ? createWalletStore({
          autoConnectEnabled: autoConnect,
          wallets: getRegisterdXRPLWallets(),
          storageKey: '@xrpl-wallet-standard/app/react',
        })
      : null,
  )

  return (
    <WalletContext.Provider value={storeRef.current}>
      {autoConnect ? <WalletAutoConnect>{children}</WalletAutoConnect> : children}
    </WalletContext.Provider>
  )
}

type WalletAutoConnectProps = Pick<WalletProviderProps, 'children'>

function WalletAutoConnect({ children }: WalletAutoConnectProps) {
  useAutoConnect()
  return children
}
