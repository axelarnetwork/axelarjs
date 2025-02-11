import { router } from "~/server/trpc";
import { findInterchainTokenByTokenId } from "./findInterchainTokenByTokenId";
import { getInterchainTokenABI } from "./getInterchainTokenABI";
import { getInterchainTokenByTokenId } from "./getInterchainTokenByTokenId";
import { getInterchainTokenDetails } from "./getInterchainTokenDetails";
import { getInterchainTokenMeta } from "./getInterchainTokenMeta";
import { getInterchainTokenRolesForAccount } from "./getInterchainTokenRolesForAccount";
import { getInterchainTokens } from "./getInterchainTokens";
import { getInterchainTokenServiceABI } from "./getInterchainTokenServiceABI";
import { getMyInterchainTokens } from "./getMyInterchainTokens";
import { getTokenManagerABI } from "./getTokenManagerABI";
import { recordInterchainTokenDeployment } from "./recordInterchainTokenDeployment";
import { recordRemoteTokensDeployment } from "./recordRemoteTokensDeployment";
import { recoverCanonicalTokenByTokenId } from "./recoverCanonicalTokenByTokenId";
import { recoverDeploymentMessageIdByTokenId } from "./recoverDeploymentMessageIdByTokenId";
import { searchInterchainToken } from "./searchInterchainToken";
import { setInterchainTokenIconUrl } from "./setInterchainTokenIconUrl";
import { updateEVMRemoteTokenAddress } from "./updateEVMRemoteAddresses";
import { updateSuiRemoteTokenAddresses } from "./updateSuiRemoteTokenAddresses";

export const interchainTokenRouter = router({
  getInterchainTokenABI,
  getInterchainTokenServiceABI,
  getInterchainTokenDetails,
  getInterchainTokenByTokenId,
  getInterchainTokenMeta,
  getInterchainTokenRolesForAccount,
  getTokenManagerABI,
  getMyInterchainTokens,
  getInterchainTokens,
  searchInterchainToken,
  recordInterchainTokenDeployment,
  recordRemoteTokensDeployment,
  findInterchainTokenByTokenId,
  recoverCanonicalTokenByTokenId,
  recoverDeploymentMessageIdByTokenId,
  setInterchainTokenIconUrl,
  updateEVMRemoteTokenAddress,
  updateSuiRemoteTokenAddresses,
});

// export type definition of API
export type InterchainTokenRouter = typeof interchainTokenRouter;
