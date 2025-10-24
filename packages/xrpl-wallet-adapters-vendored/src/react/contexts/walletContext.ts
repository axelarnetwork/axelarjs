import { createContext } from 'react'

import type { WalletStore } from '../store'

export const WalletContext = createContext<WalletStore | null>(null)
