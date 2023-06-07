import { router } from "~/server/trpc";
import { getTransactionStatus } from "./getTransactionStatus";
import { getTransactionStatusOnDestinationChains } from "./getTransactionStatusOnDestinationChains";

export const gmpRouter = router({
  getTransactionStatus,
  getTransactionStatusOnDestinationChains,
});

// export type definition of API
export type GMPRouter = typeof gmpRouter;
