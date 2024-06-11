import type {
  AxelarRecoveryApiClient,
  SearchGMPResponseData,
} from "@axelarjs/api";
import type { AxelarQueryClientService } from "@axelarjs/cosmos";

import type { ChainConfig } from "../../types";

export type SendAxelarConfirmTxParams = {
  srcChainConfig: ChainConfig;
  searchGMPData: SearchGMPResponseData;
};

export type SendAxelarConfirmTxDependencies = {
  axelarQueryRpcClient: AxelarQueryClientService;
  axelarRecoveryApiClient: AxelarRecoveryApiClient;
};
