import { useContext } from 'react'
import { useStore } from 'zustand'

import { WalletContext } from '../contexts/walletContext'
import type { Action, State } from '../store'

const isSSR = typeof window === 'undefined'

// Default state for SSR
const defaultState: State & Action = {
  autoConnectEnabled: false,
  wallets: [],
  accounts: [],
  currentWallet: null,
  currentAccount: null,
  lastConnectedAccountAddress: null,
  lastConnectedWalletName: null,
  connectionStatus: 'disconnected',
  setAccountChanged: () => {},
  setConnectionStatus: () => {},
  setWallet: () => {},
  updateWalletAccounts: () => {},
  setWalletDisconnected: () => {},
  setWalletRegistered: () => {},
  setWalletUnregistered: () => {},
}

export function useWalletStore<T>(selector: (state: Action & State) => T): T {
  const store = useContext(WalletContext)
  if (!store) {
    // TODO: fix for next.js hydration error
    if (isSSR) return selector(defaultState)
    throw new Error(
      'useWalletStore must be used within a WalletProvider. Did you forget to wrap your component in a WalletProvider?',
    )
  }
  return useStore(store, selector)
}
