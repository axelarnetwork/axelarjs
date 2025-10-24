import { useWalletStore } from './useWalletStore'

export const useAccounts = () => {
  return useWalletStore((state) => state.accounts)
}
