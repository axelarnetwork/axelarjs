import { router } from "~/server/trpc";

import { getERC20TokenBalanceForOwner } from "./getERC20TokenBalanceForOwner";
import { getERC20TokenDetails } from "./getERC20TokenDetails";
import { getTransactionStatus } from "./getTransactionStatus";
import { getTransactionStatusOnDestinationChains } from "./getTransactionStatusOnDestinationChains";
import { searchInterchainToken } from "./searchInterchainToken";

export const gmpRouter = router({
  getTransactionStatus,
  getTransactionStatusOnDestinationChains,
  searchInterchainToken,
  getERC20TokenDetails,
  getERC20TokenBalanceForOwner,
});

// export type definition of API
export type GMPRouter = typeof gmpRouter;
