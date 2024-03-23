import { router } from "~/server/trpc";
import { findInterchainTokenByTokenId } from "./findInterchainTokenByTokenId";
import { getInterchainTokenABI } from "./getInterchainTokenABI";
import { getInterchainTokenByTokenId } from "./getInterchainTokenByTokenId";
import { getInterchainTokenDetails } from "./getInterchainTokenDetails";
import { getInterchainTokenMeta } from "./getInterchainTokenMeta";
import { getInterchainTokenRolesForAccount } from "./getInterchainTokenRolesForAccount";
import { getInterchainTokenServiceABI } from "./getInterchainTokenServiceABI";
import { getInterchainTokensMissingDeploymentMessageId } from "./getInterchainTokensMissingDeploymentMessageId";
import { getMyInterchainTokens } from "./getMyInterchainTokens";
import { getTokenManagerABI } from "./getTokenManagerABI";
import { recordInterchainTokenDeployment } from "./recordInterchainTokenDeployment";
import { recordRemoteTokensDeployment } from "./recordRemoteTokensDeployment";
import { recoverCanonicalTokenByTokenId } from "./recoverCanonicalTokenByTokenId";
import { recoverDeploymentMessageIdByTokenId } from "./recoverDeploymentMessageIdByTokenId";
import { searchInterchainToken } from "./searchInterchainToken";
import { setInterchainTokenIconUrl } from "./setInterchainTokenIconUrl";

export const interchainTokenRouter = router({
  getInterchainTokenABI,
  getInterchainTokenServiceABI,
  getInterchainTokenDetails,
  getInterchainTokenByTokenId,
  getInterchainTokenMeta,
  getInterchainTokenRolesForAccount,
  getInterchainTokensMissingDeploymentMessageId,
  getTokenManagerABI,
  getMyInterchainTokens,
  searchInterchainToken,
  recordInterchainTokenDeployment,
  recordRemoteTokensDeployment,
  findInterchainTokenByTokenId,
  recoverCanonicalTokenByTokenId,
  recoverDeploymentMessageIdByTokenId,
  setInterchainTokenIconUrl,
});

// export type definition of API
export type InterchainTokenRouter = typeof interchainTokenRouter;
