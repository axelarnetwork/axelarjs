import { router } from "~/server/trpc";
import { getInterchainTokenBalanceForOwner } from "./getInterchainTokenBalanceForOwner";
import { getInterchainTokenDetails } from "./getInterchainTokenDetails";

export const interchainTokenRouter = router({
  getInterchainTokenDetails,
  getInterchainTokenBalanceForOwner,
});

// export type definition of API
export type InterchainTokenRouter = typeof interchainTokenRouter;
