import { router } from "~/server/trpc";
import { findInterchainTokenByTokenId } from "./findInterchainTokenByTokenId";
import { getInterchainTokenABI } from "./getInterchainTokenABI";
import { getInterchainTokenByTokenId } from "./getInterchainTokenByTokenId";
import { getInterchainTokenDetails } from "./getInterchainTokenDetails";
import { getInterchainTokenServiceABI } from "./getInterchainTokenServiceABI";
import { getMyInterchainTokens } from "./getMyInterchainTokens";
import { getTokenManagerABI } from "./getTokenManagerABI";
import { recordInterchainTokenDeployment } from "./recordInterchainTokenDeployment";
import { recordRemoteTokensDeployment } from "./recordRemoteTokensDeployment";
import { searchInterchainToken } from "./searchInterchainToken";

export const interchainTokenRouter = router({
  getInterchainTokenABI,
  getInterchainTokenServiceABI,
  getInterchainTokenDetails,
  getInterchainTokenByTokenId,
  getTokenManagerABI,
  getMyInterchainTokens,
  searchInterchainToken,
  recordInterchainTokenDeployment,
  recordRemoteTokensDeployment,
  findInterchainTokenByTokenId,
});

// export type definition of API
export type InterchainTokenRouter = typeof interchainTokenRouter;
