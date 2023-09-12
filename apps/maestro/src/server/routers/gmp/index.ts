import { router } from "~/server/trpc";
import { getRecentTransactions } from "./getRecentTransactions";
import { getTransactionStatus } from "./getTransactionStatus";
import { getTransactionStatusOnDestinationChains } from "./getTransactionStatusOnDestinationChains";

export const gmpRouter = router({
  getTransactionStatus,
  getTransactionStatusOnDestinationChains,
  getRecentTransactions,
});

// export type definition of API
export type GMPRouter = typeof gmpRouter;
