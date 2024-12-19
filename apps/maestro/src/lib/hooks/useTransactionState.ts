import { useState } from "react";

import type { SuiTransactionBlockResponse } from "@mysten/sui/client";
import type { TransactionReceipt } from "viem";

export type UnsubmittedTransactionState =
  | { status: "idle" }
  | { status: "awaiting_spend_approval"; amount: bigint }
  | { status: "awaiting_approval" };

export type TxType = "INTERCHAIN_DEPLOYMENT" | "INTERCHAIN_TRANSFER";
export type SubmittedTransactionState<TError = Error> =
  | {
      status: "submitted";
      hash: string;
      txType?: TxType;
      chainId: number;
      isGMP?: boolean;
      suiTx?: SuiTransactionBlockResponse;
    }
  | {
      status: "confirmed";
      receipt?: TransactionReceipt;
      hash?: string;
      txType?: TxType;
      chainId?: number;
      isGMP?: boolean;
      suiTx?: SuiTransactionBlockResponse;
    }
  | {
      status: "reverted";
      error: TError;
      hash?: string;
      txType?: TxType;
      chainId?: number;
      isGMP?: boolean;
      suiTx?: SuiTransactionBlockResponse;
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
                hash: "hash" in newState ? newState.hash : prevState.hash,
                // retain the chainId from the previous state if nil
                chainId:
                  "chainId" in newState ? newState.chainId : prevState.chainId,
                // retain the txType from the previous state if nil
                txType:
                  "txType" in newState ? newState.txType : prevState.txType,
              } as TransactionState<TError>;
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
