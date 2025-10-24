import { useWalletStore } from './useWalletStore'

export const useAccount = () => {
  return useWalletStore((state) => state.currentAccount)
}
