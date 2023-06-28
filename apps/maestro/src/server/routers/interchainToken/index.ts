import { router } from "~/server/trpc";
import { getInterchainTokenABI } from "./getInterchainTokenABI";
import { getInterchainTokenBalanceForOwner } from "./getInterchainTokenBalanceForOwner";
import { getInterchainTokenDetails } from "./getInterchainTokenDetails";
import { searchInterchainToken } from "./searchInterchainToken";

export const interchainTokenRouter = router({
  getInterchainTokenABI,
  getInterchainTokenBalanceForOwner,
  getInterchainTokenDetails,
  searchInterchainToken,
});

// export type definition of API
export type InterchainTokenRouter = typeof interchainTokenRouter;
