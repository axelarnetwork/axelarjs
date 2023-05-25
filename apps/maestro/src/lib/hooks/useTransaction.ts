/**
 * States of a web3 transaction.
 */
export type TransactionState<TError = Error> =
  /**
   * Initial state, no action taken yet.
   */
  | { kind: "idle" }

  /**
   * Awaiting confirmation from wallet.
   */
  | { kind: "pending_wallet_confirmation" }

  /**
   * Transaction signed and submitted, awaiting confirmation.
   */
  | { kind: "submitted" }

  /**
   * Transaction processed successfully.
   */
  | { kind: "success" }

  /**
   * Error occurred during transaction processing.
   * @property error - Detailed error info.
   */
  | { kind: "error"; error: TError };
