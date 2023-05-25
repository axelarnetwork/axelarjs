import { useState } from "react";

import type { TransactionReceipt } from "viem";

export type TransactionState<TError = Error> =
  | { status: "idle" }
  | { status: "awaiting_approval" }
  | { status: "submitted"; hash: `0x${string}` }
  | { status: "confirmed"; receipt: TransactionReceipt }
  | { status: "reverted"; error: TError; hash?: `0x${string}` };

export function useTransactionState<TError = Error>(
  initialState: TransactionState<TError> = { status: "idle" }
) {
  return useState<TransactionState<TError>>(initialState);
}
