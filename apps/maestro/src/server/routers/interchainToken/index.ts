import { router } from "~/server/trpc";
import { getInterchainTokenBalanceForOwner } from "./getInterchainTokenBalanceForOwner";
import { getInterchainTokenDetails } from "./getInterchainTokenDetails";
import { searchInterchainToken } from "./searchInterchainToken";

export const interchainTokenRouter = router({
  getInterchainTokenDetails,
  getInterchainTokenBalanceForOwner,
  searchInterchainToken,
});

// export type definition of API
export type InterchainTokenRouter = typeof interchainTokenRouter;
