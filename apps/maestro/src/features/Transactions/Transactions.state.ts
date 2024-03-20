import { createContainer, useSessionStorageState } from "@axelarjs/utils/react";

import type { SubmittedTransactionState } from "~/lib/hooks/useTransactionState";

type TransactionsByHash = Record<`0x${string}`, SubmittedTransactionState>;

export const {
  Provider: TransactionsProvider,
  useContainer: useTransactionsContainer,
} = createContainer(() => {
  const [transactions, setTransactions] =
    useSessionStorageState<TransactionsByHash>("@maestro/transactions", {});

  const addTransaction = (tx: SubmittedTransactionState) => {
    if (!tx.hash) return;

    setTransactions((draft) => {
      if (!tx.hash) return;

      const prev = draft[tx.hash];

      const isSame = prev?.hash === tx.hash && prev?.status === tx.status;

      if (isSame) return;

      draft[tx.hash] = {
        ...(prev ?? {}),
        ...tx,
      };
    });
  };

  const removeTransaction = (hash: `0x${string}`) => {
    setTransactions((draft) => {
      delete draft[hash];
    });
  };

  const getTransaction = (hash: `0x${string}`) => transactions[hash];

  return [
    {
      transactions,
      pendingTransactions: Object.values(transactions).filter(
        (tx) => tx.status === "submitted",
      ),
    },
    {
      addTransaction,
      getTransaction,
      removeTransaction,
    },
  ] as const;
});
