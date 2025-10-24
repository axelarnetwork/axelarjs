import type { PrepearedTransaction, XRPLIdentifierString } from '../../app'
import { useWalletStore } from './useWalletStore'

export const useSignTransaction = () => {
  const wallet = useWalletStore((state) => state.currentWallet)
  const account = useWalletStore((state) => state.currentAccount)

  const handleSignTransaction = async (transaction: PrepearedTransaction, network: XRPLIdentifierString) => {
    if (!wallet) throw new Error('Wallet is not connected')
    if (!account) throw new Error('Account is not connected')

    const signTransaction = wallet.features['xrpl:signTransaction'].signTransaction
    return await signTransaction({ tx_json: transaction, account, network })
  }

  return handleSignTransaction
}
