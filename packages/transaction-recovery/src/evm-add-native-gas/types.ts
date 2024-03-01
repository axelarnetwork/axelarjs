import { Environment } from "@axelarjs/core";

export type EvmSendOptions = {
  rpcUrl?: string;
  amount?: string;
  gasMultiplier?: number;
  refundAddress?: `0x${string}`;
  privateKey?: `0x${string}`;
};

export type EvmAddNativeGasParams = {
  environment: Environment;
  txHash: `0x${string}`;
  srcChain: string;
  estimatedGasUsed: number;
  evmSendOptions: EvmSendOptions;
};
