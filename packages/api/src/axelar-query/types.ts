import { GetFeesParams } from "..";

export type EstimateGasFeeParams = GetFeesParams & {
  gasLimit: bigint;
  gasMultiplier?: number;
  minGasPrice?: string;
  showDetailedFees?: boolean;
};

export type EstimateGasFeeResponse = {
  baseFee: number;
  expressFee: string;
  executionFee: string;
  executionFeeWithMultiplier: string;
  gasLimit: bigint;
  gasMultiplier: number;
  minGasPrice: string;
  apiResponse: string;
  isExpressSupported: boolean;
};
