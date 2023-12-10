import { useState } from "react";

import type { TransactionReceipt } from "viem";

export type UnsubmittedTransactionState =
  | { status: "idle" }
  | { status: "awaiting_spend_approval"; amount: bigint }
  | { status: "awaiting_approval" };

export type SubmittedTransactionState<TError = Error> =
  | {
      status: "submitted";
      hash: `0x${string}`;
      chainId: number;
      isGMP?: boolean;
    }
  | {
      status: "confirmed";
      receipt: TransactionReceipt;
      hash: `0x${string}`;
      chainId: number;
      isGMP?: boolean;
    }
  | {
      status: "reverted";
      error: TError;
      hash: `0x${string}`;
      chainId: number;
      isGMP?: boolean;
    };

export type TransactionState<TError = Error> =
  | UnsubmittedTransactionState
  | SubmittedTransactionState<TError>;

export function useTransactionState<TError = Error>(
  initialState: TransactionState<TError> = { status: "idle" }
) {
  const [state, _setState] = useState<TransactionState<TError>>(initialState);

  const setState: typeof _setState = (newState) => {
    if (typeof newState === "function") {
      return _setState(newState);
    }
    switch (newState.status) {
      case "reverted":
      case "confirmed":
        return _setState((prevState) => {
          switch (prevState.status) {
            case "submitted":
              return {
                ...newState,
                // retain the hash from the previous state if nil
                hash: newState.hash ?? prevState.hash,
              };
            default:
              return newState;
          }
        });
      default:
        return _setState(newState);
    }
  };

  return [state, setState] as const;
}
