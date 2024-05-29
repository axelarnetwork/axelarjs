export const ConfirmGatewayTxError = {
  NOT_FINALIZED: (txHash: string) =>
    new Error(`Not enough confirmations for tx ${txHash}.`),
  FAILED_FETCH_EVM_EVENT: new Error("Failed to fetch EVM event"),
  EVM_EVENT_NOT_FOUND: new Error("EVM event not found"),
};
