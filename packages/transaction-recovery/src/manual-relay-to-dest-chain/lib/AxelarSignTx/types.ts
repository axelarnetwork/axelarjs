import type {
  AxelarRecoveryApiClient,
  AxelarscanClient,
  SearchGMPResponseData,
} from "@axelarjs/api";

import type { ChainConfig } from "../../types";

export type SendAxelarSignTxParams = {
  searchGMPData: SearchGMPResponseData;
  srcChainConfig: ChainConfig;
};

export type SendAxelarSignTxDependencies = {
  axelarscanClient: AxelarscanClient;
  axelarRecoveryApiClient: AxelarRecoveryApiClient;
};
