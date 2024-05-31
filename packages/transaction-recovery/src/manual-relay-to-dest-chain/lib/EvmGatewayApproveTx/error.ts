export const GatewayApproveError = {
  RPC_NOT_FOUND: (chain: string) =>
    new Error(`Cannot find rpcUrl for ${chain}`),
  EXECUTE_DATA_NOT_FOUND: new Error(
    "Cannot find executeData from batch response"
  ),
  FAILED_TX: (err: Error) =>
    new Error(`Failed to send approve tx: ${err.message}`),
};
