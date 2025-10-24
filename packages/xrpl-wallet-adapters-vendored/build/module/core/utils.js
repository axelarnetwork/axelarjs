export const REQUIRED_FEATURES = [
    'standard:connect',
    'standard:events',
    'xrpl:signTransaction',
    'xrpl:signAndSubmitTransaction',
];
export function isXRPLWallet(wallet) {
    return isWalletWithRequiredFeatureSet(wallet);
}
export function isWalletWithRequiredFeatureSet(wallet, additionalFeatures = []) {
    return [...REQUIRED_FEATURES, ...additionalFeatures].every((feature) => feature in wallet.features);
}
