import { router } from "~/server/trpc";
import { getRecentTransactions } from "./getRecentTransactions";
import { getTopTransactions } from "./getTopTransactions";
import { getTransactionStatus } from "./getTransactionStatus";
import { getTransactionStatusOnDestinationChains } from "./getTransactionStatusOnDestinationChains";

export const gmpRouter = router({
  getTransactionStatus,
  getTransactionStatusOnDestinationChains,
  getRecentTransactions,
  getTopTransactions,
});

// export type definition of API
export type GMPRouter = typeof gmpRouter;
