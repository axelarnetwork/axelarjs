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
  txHash: `0x${string}`;
  chain: string;
  estimatedGasUsed: number;
  evmSendOptions: EvmSendOptions;
};

export type EvmSendOptions = {
  environment: Environment;
  amount?: string;
  refundAddress?: string;
  gasMultipler?: number;
  logIndex?: number;
  destChain?: string;
  evmWalletDetails?: EvmWalletDetails;
};

export type EvmWalletDetails = {
  privateKey?: string;
  useWindowEthereum?: boolean;
  rpcUrl?: string;
  gasLimitBuffer?: number;
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
