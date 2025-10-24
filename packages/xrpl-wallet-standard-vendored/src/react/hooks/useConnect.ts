import type { StandardConnectInput, XRPLWallet } from '../../app'
import { useWalletStore } from './useWalletStore'

export const useConnect = () => {
  const connectionStatus = useWalletStore((state) => state.connectionStatus)
  const setConnectionStatus = useWalletStore((state) => state.setConnectionStatus)
  const setWallet = useWalletStore((state) => state.setWallet)

  const handleConnect = async (wallet: XRPLWallet, input?: StandardConnectInput) => {
    setConnectionStatus('connecting')
    try {
      const { accounts } = await wallet.features['standard:connect'].connect(input)

      if (accounts.length === 0) {
        throw new Error('No accounts found')
      }

      const account = accounts[0]

      setWallet(wallet, accounts, account)
      setConnectionStatus('connected')
    } catch (e: any) {
      setConnectionStatus('disconnected')
      throw e
    }
  }

  return { connect: handleConnect, status: connectionStatus }
}
