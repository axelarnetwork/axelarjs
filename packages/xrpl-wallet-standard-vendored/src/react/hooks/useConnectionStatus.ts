import type { WalletConnectionStatus } from '../store'
import { useWalletStore } from './useWalletStore'

export const useConnectionStatus = (): WalletConnectionStatus => {
  const status = useWalletStore((state) => state.connectionStatus)
  return status
}
