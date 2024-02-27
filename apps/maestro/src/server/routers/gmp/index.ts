import { router } from "~/server/trpc";
import { getRecentTransactions } from "./getRecentTransactions";
import { getTopTransactions } from "./getTopTransactions";
import { getTransactionStatus } from "./getTransactionStatus";
import { getTransactionStatusesOnDestinationChains } from "./getTransactionStatusesOnDestinationChains";
import { getTransactionStatusOnDestinationChains } from "./getTransactionStatusOnDestinationChains";

export const gmpRouter = router({
  getTransactionStatus,
  getTransactionStatusOnDestinationChains,
  getTransactionStatusesOnDestinationChains,
  getRecentTransactions,
  getTopTransactions,
});

// export type definition of API
export type GMPRouter = typeof gmpRouter;
