export const EvmAddNativeGasError = {
  NO_PAYMENT_REQUIRED: new Error("This transaction does not require gas paid"),
  ENOUGH_PAID: new Error("This transaction already has paid enough gas"),
  INVALID_GMP_TX: new Error("Invalid GMP Tx"),
  GAS_SERVICE_ADDRESS_NOT_FOUND: (chain: string) =>
    new Error(`Gas service address not found for ${chain}`),
  REFUND_ADDRESS_NOT_FOUND: "Refund address not found",
  SENDER_ADDRESS_NOT_FOUND: "Sender address not found",
  CHAIN_CONFIG_NOT_FOUND: (chain: string) =>
    new Error(`Chain config not found ${chain}`),
  WALLET_CLIENT_NOT_FOUND: new Error(
    "Either 'window.ethereum' or 'evmWalletDetails.privateKey' must be provided"
  ),
};
