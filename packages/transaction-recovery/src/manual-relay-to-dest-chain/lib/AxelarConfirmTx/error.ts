export const ConfirmGatewayTxError = {
  NOT_FINALIZED: (txHash: string) =>
    new Error(`Not enough confirmations for tx ${txHash}.`),
  FAILED_FETCH_EVM_EVENT: new Error(
    "Failed to fetch EVM event. Please ensure the transaction has paid the gas and try again."
  ),
  EVM_EVENT_NOT_FOUND: new Error("EVM event not found"),
  FAILED_TO_CONFIRM: (errorMsg: string) =>
    new Error("Failed to confirm the transaction:" + errorMsg),
};
