import type {
  RequiredFetures,
  Wallet,
  XRPLIdentifierString,
  XRPLSignAndSubmitTransactionFeature,
  XRPLSignTransactionFeature,
} from '../core'
import type { XRPLWalletAccount } from './walletAccount'

export abstract class XRPLBaseWallet implements Wallet {
  abstract get version(): Wallet['version']
  abstract get chains(): XRPLIdentifierString[]
  abstract get accounts(): XRPLWalletAccount[]
  abstract get icon(): Wallet['icon']

  abstract get name(): Wallet['name']

  abstract get features(): RequiredFetures & XRPLSignTransactionFeature & XRPLSignAndSubmitTransactionFeature
}
