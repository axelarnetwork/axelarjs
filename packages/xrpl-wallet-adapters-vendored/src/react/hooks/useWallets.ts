import { useWalletStore } from './useWalletStore'

export const useWallets = () => {
  return useWalletStore((state) => state.wallets)
}
