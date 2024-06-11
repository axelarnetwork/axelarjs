import type {
  AxelarRecoveryApiClient,
  AxelarscanClient,
  SearchGMPResponseData,
} from "@axelarjs/api";
import type { AxelarQueryClientService } from "@axelarjs/cosmos";

import type { ChainConfig } from "../../types";

export type SendEvmGatewayApproveTxParams = {
  searchGMPData: SearchGMPResponseData;
  destChainConfig: ChainConfig;
};

export type SendEvmGatewayApproveTxDependencies = {
  axelarQueryRpcClient: AxelarQueryClientService;
  axelarscanClient: AxelarscanClient;
  axelarRecoveryApiClient: AxelarRecoveryApiClient;
};

export type TransactionRequest = {
  to?: string;
  from?: string;
  nonce?: string;

  gasLimit?: number;
  gasPrice?: bigint;

  data?: string;
  value?: bigint;
  chainId?: number;

  type?: number;
};
