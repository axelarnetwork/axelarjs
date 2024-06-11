export const EvmClientError = {
  WALLET_CLIENT_NOT_FOUND: new Error(
    "Either 'window.ethereum' or 'privateKey' must be provided"
  ),
};
