export const ConfirmGatewayTxError = {
  NOT_FINALIZED: (
    txHash: string,
    numRequiredConfirmations: bigint,
    currentBlockNumber: bigint,
    srcTxBlockNumber: bigint
  ) =>
    new Error(
      `Not enough confirmations for tx ${txHash}. Required ${numRequiredConfirmations}, got ${
        currentBlockNumber - srcTxBlockNumber
      }`
    ),
  FAILED_FETCH_EVM_EVENT: new Error("Failed to fetch EVM event"),
  EVM_EVENT_NOT_FOUND: new Error("EVM event not found"),
};
