import { useState } from "react";

import { rpc } from "@stellar/stellar-sdk";

interface PollingOptions {
  maxAttempts?: number;
  intervalMs?: number;
  onStatusUpdate?: (status: {
    type: string;
    txHash?: string;
    attempt?: number;
    totalAttempts?: number;
  }) => void;
}

interface PollingResult<T> {
  status: "SUCCESS" | "FAILED" | "TIMEOUT";
  data?: T;
  response?: rpc.Api.GetTransactionResponse;
  error?: Error;
}

/**
 * Hook to poll Stellar transactions
 */
export function useStellarTransactionPoller() {
  const [isPolling, setIsPolling] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Polls a Stellar transaction until it is confirmed or fails
   * @param server Stellar RPC server
   * @param txHash Transaction hash
   * @param options Polling options
   * @returns Polling result with transaction status and data
   */
  const pollTransaction = async <T>(
    server: rpc.Server,
    txHash: string,
    options: PollingOptions = {},
    processResult?: (response: rpc.Api.GetTransactionResponse) => T
  ): Promise<PollingResult<T>> => {
    const { maxAttempts = 20, intervalMs = 1000, onStatusUpdate } = options;

    setIsPolling(true);
    setError(null);

    try {
      for (let i = 0; i < maxAttempts; i++) {
        // Wait for the interval before making the next attempt
        await new Promise((resolve) => setTimeout(resolve, intervalMs));

        try {
          // Update the status for the user
          onStatusUpdate?.({
            type: "polling",
            txHash,
            attempt: i + 1,
            totalAttempts: maxAttempts,
          });

          // Fetch the transaction status
          const txResponse = await server.getTransaction(txHash);

          // Check if the transaction was confirmed successfully
          if (txResponse.status === rpc.Api.GetTransactionStatus.SUCCESS) {
            // Process the result if a processing function was provided
            const processedData = processResult
              ? processResult(txResponse)
              : undefined;

            setIsPolling(false);
            return {
              status: "SUCCESS",
              data: processedData as T,
              response: txResponse,
            };
          }
          // Check if the transaction failed
          else if (txResponse.status === rpc.Api.GetTransactionStatus.FAILED) {
            const resultXdrBase64 = txResponse.resultXdr
              ? txResponse.resultXdr.toXDR("base64")
              : "N/A";
            const failReason = `Transaction failed on-chain. Result XDR (base64): ${resultXdrBase64}`;

            const error = new Error(failReason);
            setError(error);
            setIsPolling(false);

            return {
              status: "FAILED",
              error,
            };
          }
          // If the transaction has not been processed, continue polling
        } catch (pollingError) {
          const error = new Error(
            `Polling with getTransaction failed: ${pollingError instanceof Error ? pollingError.message : String(pollingError)}`
          );
          setError(error);
          setIsPolling(false);

          return {
            status: "FAILED",
            error,
          };
        }
      }

      // If we've reached this point, the polling has exceeded the maximum number of attempts without success
      const timeoutError = new Error(
        `Transaction did not succeed after ${maxAttempts} polling attempts.`
      );
      setError(timeoutError);
      setIsPolling(false);

      return {
        status: "TIMEOUT",
        error: timeoutError,
      };
    } catch (e) {
      const error = e instanceof Error ? e : new Error(String(e));
      setError(error);
      setIsPolling(false);

      return {
        status: "FAILED",
        error,
      };
    }
  };

  return {
    pollTransaction,
    isPolling,
    error,
  };
}
