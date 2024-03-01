import type {
  AxelarCosmosChainConfig,
  AxelarQueryAPIClient,
  SearchGMPResponseData,
} from "@axelarjs/api";
import type { Environment } from "@axelarjs/core";

import type { OfflineSigner } from "@cosmjs/proto-signing";
import type { Coin, DeliverTxResponse, StdFee } from "@cosmjs/stargate";
import type { DecodeEventLogReturnType } from "viem";

export type SendOptions = {
  txFee: StdFee;
  environment: Environment;
  offlineSigner: OfflineSigner;
  rpcUrl?: string;
  timeoutTimestamp?: number;
};

export type EventLog = {
  signature: string;
  eventLog: DecodeEventLogReturnType;
  logIndex: number;
  eventIndex: number;
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

export type EvmAddNativeGasParams = {
  environment: Environment;
  txHash: `0x${string}`;
  srcChain: string;
  estimatedGasUsed: number;
  evmSendOptions: EvmSendOptions;
};

export type EvmSendOptions = {
  rpcUrl?: string;
  amount?: string;
  gasMultiplier?: number;
  refundAddress?: `0x${string}`;
  privateKey?: `0x${string}`;
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

export interface QueryGasFeeOptions {
  gasTokenSymbol?: string;
  gasMultipler?: number;
  shouldSubtractBaseFee?: boolean;
}
