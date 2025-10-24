import type { XRPLWallet } from '../../app'
import { useEffect } from 'react'
import type { WalletConnectionStatus } from '../store'
import { useDisconnect } from './useDisconnect'
import { useEvent } from './useEvent'
import { useWalletStore } from './useWalletStore'

type UseWalletResult = {
  wallet: XRPLWallet | null
  status: WalletConnectionStatus
}

export const useWallet = (): UseWalletResult => {
  const wallet = useWalletStore((state) => state.currentWallet)
  const status = useWalletStore((state) => state.connectionStatus)
  const { onChange } = useEvent()
  const disconnect = useDisconnect()

  useEffect(() => {
    onChange(({ accounts }) => {
      if (accounts && accounts.length === 0) disconnect()
    })
  }, [disconnect, onChange])

  if (status === 'connecting') {
    return {
      wallet,
      status,
    }
  }
  if (status === 'connected') {
    if (!wallet) throw new Error('Wallet is connected but no wallet is set')
    return {
      wallet,
      status,
    }
  }
  if (status === 'disconnected') {
    return {
      wallet: null,
      status,
    }
  }
  throw new Error(`Unexpected connection status: ${status}`)
}
