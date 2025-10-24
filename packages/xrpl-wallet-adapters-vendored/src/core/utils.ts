import type { StandardConnectFeature, StandardEventsFeature, Wallet, WalletWithFeatures } from '@wallet-standard/core'
import type { XRPLSignAndSubmitTransactionFeature, XRPLSignTransactionFeature } from './features'

export const REQUIRED_FEATURES = [
  'standard:connect',
  'standard:events',
  'xrpl:signTransaction',
  'xrpl:signAndSubmitTransaction',
] as const

export type RequiredFetures = StandardConnectFeature &
  StandardEventsFeature &
  XRPLSignTransactionFeature &
  XRPLSignAndSubmitTransactionFeature

export type XRPLWallet = WalletWithFeatures<RequiredFetures>

export function isXRPLWallet(wallet: Wallet): wallet is XRPLWallet {
  return isWalletWithRequiredFeatureSet(wallet)
}

export function isWalletWithRequiredFeatureSet<AdditionalFeatures extends Wallet['features']>(
  wallet: Wallet,
  additionalFeatures: (keyof AdditionalFeatures)[] = [],
): wallet is WalletWithFeatures<RequiredFetures & AdditionalFeatures> {
  return [...REQUIRED_FEATURES, ...additionalFeatures].every((feature) => feature in wallet.features)
}
