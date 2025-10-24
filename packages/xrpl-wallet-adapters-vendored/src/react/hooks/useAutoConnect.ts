import { getRegisterdXRPLWallets } from '../../app'
import { useEffect } from 'react'
import { useConnect } from './useConnect'
import { useWallet } from './useWallet'
import { useWalletStore } from './useWalletStore'

export const useAutoConnect = () => {
  const { connect } = useConnect()
  const lastConnectedAccountAddress = useWalletStore((state) => state.lastConnectedAccountAddress)
  const lastConnectedWalletName = useWalletStore((state) => state.lastConnectedWalletName)
  const { status } = useWallet()

  // biome-ignore lint/correctness/useExhaustiveDependencies: execute only once
  useEffect(() => {
    if (status !== 'disconnected' || !lastConnectedAccountAddress || !lastConnectedWalletName) {
      return
    }

    const lastConnectedWallet = getRegisterdXRPLWallets().find((wallet) => wallet.name === lastConnectedWalletName)
    if (!lastConnectedWallet) return
    setTimeout(() => {
      // fixme: extension wallet shoud wait for connect with global Window object
      connect(lastConnectedWallet, { silent: true })
    }, 1000)
  }, [])
}
