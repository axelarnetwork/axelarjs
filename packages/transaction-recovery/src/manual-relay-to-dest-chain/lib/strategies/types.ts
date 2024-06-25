import type { SearchGMPResponseData } from "@axelarjs/api";
import type { AxelarQueryClientService } from "@axelarjs/cosmos";

import type { ManualRelayToDestChainDependencies } from "../../isomorphic";
import { type ChainConfig } from "../../types";

export type RecoveryDependencies = ManualRelayToDestChainDependencies & {
  axelarQueryRpcClient: AxelarQueryClientService;
};

export type RecoveryParams = {
  searchGMPData: SearchGMPResponseData;
  srcChainConfig: ChainConfig;
  destChainConfig: ChainConfig;
  escapeAfterConfirm?: boolean | undefined;
  messageId?: string | undefined;
};
