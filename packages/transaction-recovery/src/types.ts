import type {
  AxelarCosmosChainConfig,
  AxelarQueryAPIClient,
  SearchGMPResponseData,
} from "@axelarjs/api";
import type { Environment } from "@axelarjs/core";

import type { OfflineSigner } from "@cosmjs/proto-signing";
import type { Coin, DeliverTxResponse, StdFee } from "@cosmjs/stargate";

export type SendOptions = {
  txFee: StdFee;
  environment: Environment;
  offlineSigner: OfflineSigner;
  rpcUrl?: string;
  timeoutTimestamp?: number;
};

export type AutocalculateGasOptions = {
  gasLimit?: bigint;
  gasMultipler?: number;
};
export type AddGasParams = {
  txHash: string;
  chain: string;
  token: Coin | "autocalculate";
  sendOptions: SendOptions;
  autocalculateGasOptions?: AutocalculateGasOptions;
};

export type AddGasResponse = {
  success: boolean;
  info: string;
  broadcastResult?: DeliverTxResponse;
};

export type GetFullFeeOptions = {
  autocalculateGasOptions?: AutocalculateGasOptions | undefined;
  tx: SearchGMPResponseData;
  chainConfig: AxelarCosmosChainConfig;
  axelarQueryClient: AxelarQueryAPIClient;
  environment: Environment;
};
