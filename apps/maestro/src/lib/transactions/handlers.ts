import { toast } from "@axelarjs/ui/toaster";

import { TransactionExecutionError } from "viem";
import type { WriteContractResult } from "wagmi/actions";

import { logger } from "~/lib/logger";

type TransactionResultHooks = {
  onSuccess?: (tx: WriteContractResult) => void;
  onTransactionError?: (error: TransactionExecutionError) => void;
  onUnknownError?: (error: Error) => void;
};

const DEFAULT_HOOKS: TransactionResultHooks = {
  onSuccess: (result) => result,
  onTransactionError: (error) => toast.error(error.shortMessage),
  onUnknownError: (error) => logger.error(error.message),
};

/**
 * Handles the outcome of a wagmi contract write transaction by invoking specified callback hooks.
 *
 * @param {Promise<WriteContractResult>} tx - A Promise resolving to the transaction result.
 * @param {TransactionResultHooks} [hooks] - Optional hooks for handling transaction outcomes.
 * @param {Function} [hooks.onSuccess] - Called upon successful transaction. Receives the transaction result.
 * @param {Function} [hooks.onTransactionError] - Called when a `TransactionExecutionError` occurs. Receives the error object.
 * @param {Function} [hooks.onUnknownError] - Called for unknown errors. Receives the error object.
 *
 * @example
 * ```typescript
 * handleTransactionResult(transactionPromise, {
 *   onSuccess: (result) => console.log(`Transaction successful: ${result}`),
 *   onTransactionError: (error) => console.error(`Transaction failed: ${error.shortMessage}`),
 *   onUnknownError: (error) => console.error(`Unknown error: ${error.message}`)
 * });
 * ```
 */
export async function handleTransactionResult(
  tx: Promise<WriteContractResult>,
  hooks: TransactionResultHooks
): Promise<void> {
  const handleSuccess = hooks.onSuccess ?? DEFAULT_HOOKS.onSuccess;
  const handleTransactionError =
    hooks.onTransactionError ?? DEFAULT_HOOKS.onTransactionError;
  const handleUnknownError =
    hooks.onUnknownError ?? DEFAULT_HOOKS.onUnknownError;

  try {
    const result = await tx;

    handleSuccess?.(result);
  } catch (error) {
    if (error instanceof TransactionExecutionError) {
      handleTransactionError?.(error);
    } else if (error instanceof Error) {
      handleUnknownError?.(error);
    }
  }
}
