import type { StandardEventsChangeProperties } from '../../app'
import { useWalletStore } from './useWalletStore'

export const useEvent = () => {
  const wallet = useWalletStore((state) => state.currentWallet)

  const onChange = (listener: (properties: StandardEventsChangeProperties) => void) => {
    wallet?.features['standard:events'].on('change', listener)
  }

  return { onChange }
}
