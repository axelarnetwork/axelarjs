export const EvmAddNativeGasError = {
  ENOUGH_PAID: new Error("This transaction already has paid enough gas"),
  INVALID_GMP_TX: new Error("Invalid GMP Tx"),
  REFUND_ADDRESS_NOT_FOUND: "Refund address not found",
  GAS_SERVICE_ADDRESS_NOT_FOUND: (chain: string) =>
    new Error(`Gas service address not found for ${chain}`),
  CHAIN_CONFIG_NOT_FOUND: (chain: string) =>
    new Error(`Chain config not found ${chain}`),
  WALLET_CLIENT_NOT_FOUND: new Error(
    "Either 'window.ethereum' or 'privateKey' must be provided",
  ),
};
