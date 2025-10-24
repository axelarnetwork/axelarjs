"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.REQUIRED_FEATURES = void 0;
exports.isXRPLWallet = isXRPLWallet;
exports.isWalletWithRequiredFeatureSet = isWalletWithRequiredFeatureSet;
exports.REQUIRED_FEATURES = [
    'standard:connect',
    'standard:events',
    'xrpl:signTransaction',
    'xrpl:signAndSubmitTransaction',
];
function isXRPLWallet(wallet) {
    return isWalletWithRequiredFeatureSet(wallet);
}
function isWalletWithRequiredFeatureSet(wallet, additionalFeatures = []) {
    return [...exports.REQUIRED_FEATURES, ...additionalFeatures].every((feature) => feature in wallet.features);
}
