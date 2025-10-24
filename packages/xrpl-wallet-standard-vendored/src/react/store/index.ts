import type { Wallet, WalletAccount, XRPLWallet } from '../../app'
import { createStore } from 'zustand'
import { type StateStorage, createJSONStorage, persist } from 'zustand/middleware'

export type WalletConnectionStatus = 'disconnected' | 'connecting' | 'connected'

export type Action = {
  setAccountChanged: (account: WalletAccount) => void
  setConnectionStatus: (connectionStatus: WalletConnectionStatus) => void
  setWallet: (
    wallet: XRPLWallet,
    connectedAccounts: readonly WalletAccount[],
    selectedAccount: WalletAccount | null,
  ) => void
  updateWalletAccounts: (accounts: readonly WalletAccount[]) => void
  setWalletDisconnected: () => void
  setWalletRegistered: (updatedWallets: XRPLWallet[]) => void
  setWalletUnregistered: (updatedWallets: XRPLWallet[], unregisteredWallet: Wallet) => void
}

export type State = {
  autoConnectEnabled: boolean
  wallets: XRPLWallet[]
  accounts: readonly WalletAccount[]
  currentWallet: XRPLWallet | null
  currentAccount: WalletAccount | null
  lastConnectedAccountAddress: string | null
  lastConnectedWalletName: string | null
  connectionStatus: WalletConnectionStatus
}

type WalletConfiguration = {
  autoConnectEnabled: boolean
  wallets: XRPLWallet[]
  storage?: StateStorage
  storageKey: string
}

export function createWalletStore({ wallets, storage, storageKey, autoConnectEnabled }: WalletConfiguration) {
  return createStore<State & Action>()(
    persist(
      (set, get) => ({
        autoConnectEnabled,
        wallets,
        accounts: [] as readonly WalletAccount[],
        currentWallet: null,
        currentAccount: null,
        lastConnectedAccountAddress: null,
        lastConnectedWalletName: null,
        connectionStatus: 'disconnected',
        setConnectionStatus(connectionStatus) {
          set(() => ({
            connectionStatus,
          }))
        },
        setWallet(wallet, connectedAccounts, selectedAccount) {
          set(() => ({
            accounts: connectedAccounts,
            currentWallet: wallet,
            currentAccount: selectedAccount,
            lastConnectedWalletName: wallet.name,
            lastConnectedAccountAddress: selectedAccount?.address,
            connectionStatus: 'connected',
          }))
        },
        setWalletDisconnected() {
          set(() => ({
            accounts: [],
            currentWallet: null,
            currentAccount: null,
            lastConnectedWalletName: null,
            lastConnectedAccountAddress: null,
            connectionStatus: 'disconnected',
          }))
        },
        setAccountChanged(selectedAccount) {
          set(() => ({
            currentAccount: selectedAccount,
            lastConnectedAccountAddress: selectedAccount.address,
          }))
        },
        setWalletRegistered(updatedWallets) {
          set(() => ({ wallets: updatedWallets }))
        },
        setWalletUnregistered(updatedWallets, unregisteredWallet) {
          if (unregisteredWallet === get().currentWallet) {
            set(() => ({
              wallets: updatedWallets,
              accounts: [],
              currentWallet: null,
              currentAccount: null,
              lastConnectedWalletName: null,
              lastConnectedAccountAddress: null,
              connectionStatus: 'disconnected',
            }))
          } else {
            set(() => ({ wallets: updatedWallets }))
          }
        },
        updateWalletAccounts(accounts) {
          const currentAccount = get().currentAccount

          set(() => ({
            accounts,
            currentAccount:
              (currentAccount && accounts.find(({ address }) => address === currentAccount.address)) || accounts[0],
          }))
        },
      }),
      {
        name: storageKey,
        storage: createJSONStorage(() => storage || localStorage),
        partialize: ({ lastConnectedWalletName, lastConnectedAccountAddress }) => ({
          lastConnectedWalletName,
          lastConnectedAccountAddress,
        }),
      },
    ),
  )
}

export type WalletStore = ReturnType<typeof createWalletStore>
