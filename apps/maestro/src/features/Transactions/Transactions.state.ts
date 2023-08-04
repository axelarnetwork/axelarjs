import { createContainer, useSessionStorageState } from "@axelarjs/utils/react";

import {
  useNetwork,
  usePublicClient,
  useWatchPendingTransactions,
} from "wagmi";

import type { SubmittedTransactionState } from "~/lib/hooks/useTransactionState";

type TransactionsByHash = Record<`0x${string}`, SubmittedTransactionState>;

export const {
  Provider: TransactionsProvider,
  useContainer: useTransactionsContainer,
} = createContainer(() => {
  const { chain } = useNetwork();

  const publicClient = usePublicClient();
  const [transactions, setTransactions] =
    useSessionStorageState<TransactionsByHash>("@maestro/transactions", {});

  const addTransaction = (tx: SubmittedTransactionState) => {
    if (!tx.hash) return;

    setTransactions((draft) => {
      if (!tx.hash) return;

      const prev = draft[tx.hash];

      draft[tx.hash] = {
        ...(prev ?? {}),
        ...tx,
      };
    });
  };

  useWatchPendingTransactions({
    chainId: chain?.id,
    enabled: Boolean(chain),
    listener: (txHashes) => {
      console.log("pending txs", { txHashes });

      setTransactions(async (draft) => {
        for (const txHash of txHashes) {
          const txDetails = await publicClient.getTransaction({
            hash: txHash,
          });

          console.log({ txDetails });

          draft[txHash] = {
            status: "submitted",
            hash: txHash,
          };
        }
      });
    },
  });

  const getTransaction = (hash: `0x${string}`) => transactions[hash];

  return [
    {
      transactions,
    },
    {
      addTransaction,
      getTransaction,
    },
  ] as const;
});
