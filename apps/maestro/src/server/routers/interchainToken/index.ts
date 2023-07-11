import { router } from "~/server/trpc";
import { getInterchainTokenABI } from "./getInterchainTokenABI";
import { getInterchainTokenBalanceForOwner } from "./getInterchainTokenBalanceForOwner";
import { getInterchainTokenDetails } from "./getInterchainTokenDetails";
import { getInterchainTokenServiceABI } from "./getInterchainTokenServiceABI";
import { recordInterchainTokenDeployment } from "./recordInterchainTokenDeployment";
import { searchInterchainToken } from "./searchInterchainToken";

export const interchainTokenRouter = router({
  getInterchainTokenABI,
  getInterchainTokenServiceABI,
  getInterchainTokenBalanceForOwner,
  getInterchainTokenDetails,
  searchInterchainToken,
  recordInterchainTokenDeployment,
});

// export type definition of API
export type InterchainTokenRouter = typeof interchainTokenRouter;
