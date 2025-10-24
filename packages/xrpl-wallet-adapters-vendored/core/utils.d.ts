import type { StandardConnectFeature, StandardEventsFeature, Wallet, WalletWithFeatures } from '@wallet-standard/core';
import type { XRPLSignAndSubmitTransactionFeature, XRPLSignTransactionFeature } from './features';
export declare const REQUIRED_FEATURES: readonly ["standard:connect", "standard:events", "xrpl:signTransaction", "xrpl:signAndSubmitTransaction"];
export type RequiredFetures = StandardConnectFeature & StandardEventsFeature & XRPLSignTransactionFeature & XRPLSignAndSubmitTransactionFeature;
export type XRPLWallet = WalletWithFeatures<RequiredFetures>;
export declare function isXRPLWallet(wallet: Wallet): wallet is XRPLWallet;
export declare function isWalletWithRequiredFeatureSet<AdditionalFeatures extends Wallet['features']>(wallet: Wallet, additionalFeatures?: (keyof AdditionalFeatures)[]): wallet is WalletWithFeatures<RequiredFetures & AdditionalFeatures>;
