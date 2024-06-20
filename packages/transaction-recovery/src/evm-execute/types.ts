import { Environment } from "@axelarjs/core";

export type EvmExecuteOptions = {
  rpcUrl?: string;
  privateKey?: `0x${string}`;
};

export type EvmExecuteParams = {
  environment: Environment;
  srcTxHash: string;
  srcTxLogIndex?: number;
  estimatedGasUsed: number;
  executeOptions?: EvmExecuteOptions;
};

export type EvmExecuteData = {
  txHash: string;
};

export type EvmExecuteResult = {
  success: boolean;
  error?: string | undefined;
  data?: EvmExecuteData | undefined;
};
