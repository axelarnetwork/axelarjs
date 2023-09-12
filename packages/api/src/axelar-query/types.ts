import { GetFeesParams } from "..";

export type EstimateGasFeeParams = GetFeesParams & {
  gasLimit: bigint;
  gasMultiplier?: number;
  minGasPrice?: string;
  showDetailedFees?: boolean;
  transferAmount?: number; // In terms of symbol, not unit denom, e.g. use 1 for 1 axlUSDC, not 1000000
  transferAmountInUnits?: string; // In terms of unit denom, not symbol, e.g. use 1000000 for 1 axlUSDC, not 1
};
