import type { GetFeesParams } from "..";

export type EstimateGasFeeParams = GetFeesParams & {
  gasLimit: bigint;
  gasMultiplier: number | "auto";
  minGasPrice?: string;
  showDetailedFees?: boolean;
};

export type EstimateGasFeeResponse = {
  baseFee: bigint;
  expressFee: string;
  executionFee: string;
  executionFeeWithMultiplier: string;
  l1ExecutionFee: string;
  l1ExecutionFeeWithMultiplier: string;
  gasLimit: bigint;
  gasMultiplier: number;
  minGasPrice: string;
  apiResponse: string;
  isExpressSupported: boolean;
};
