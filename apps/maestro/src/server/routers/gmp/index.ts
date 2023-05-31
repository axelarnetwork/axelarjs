import { router } from "~/server/trpc";
import { getTransactionStatus } from "./getTransactionStatus";
import { getTransactionStatusOnDestinationChains } from "./getTransactionStatusOnDestinationChains";
import { searchInterchainToken } from "./searchInterchainToken";

export const gmpRouter = router({
  getTransactionStatus,
  getTransactionStatusOnDestinationChains,
  searchInterchainToken,
});

// export type definition of API
export type GMPRouter = typeof gmpRouter;
