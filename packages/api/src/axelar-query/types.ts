import type { GetFeesParams } from "..";

export type EstimateGasFeeParams = GetFeesParams & {
  gasLimit: bigint;
  gasMultiplier?: number;
  minGasPrice?: string;
  showDetailedFees?: boolean;
};

export type EstimateGasFeeResponse = {
  baseFee: bigint;
  expressFee: string;
  executionFee: string;
  executionFeeWithMultiplier: string;
  gasLimit: bigint;
  gasMultiplier: number;
  minGasPrice: string;
  apiResponse: string;
  isExpressSupported: boolean;
};
