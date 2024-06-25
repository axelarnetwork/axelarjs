export const ManualRelayToDestChainError = {
  TX_NOT_FOUND: new Error(
    `Transaction not found. Please check the txHash and try again`
  ),
  CHAIN_NOT_FOUND: new Error(
    `Chain not found. Please check the chainId and try again`
  ),
  TX_ALREADY_EXECUTED: new Error(
    `Transaction already executed. Please check the txHash and try again`
  ),
};
