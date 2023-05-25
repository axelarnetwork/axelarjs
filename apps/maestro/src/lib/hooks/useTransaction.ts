import { useState } from "react";

import type { TransactionReceipt } from "viem";

export type TransactionState<TError = Error> =
  | { status: "idle" }
  | { status: "awaiting_approval" }
  | { status: "submitted"; hash: `0x${string}` }
  | { status: "confirmed"; receipt: TransactionReceipt; hash?: `0x${string}` }
  | { status: "reverted"; error: TError; hash?: `0x${string}` };

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
