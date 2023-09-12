import { GetFeesParams } from "..";

export type GMPParams = {
  showDetailedFees?: boolean;
  transferAmount?: number; // In terms of symbol, not unit denom, e.g. use 1 for 1 axlUSDC, not 1000000
  transferAmountInUnits?: string; // In terms of unit denom, not symbol, e.g. use 1000000 for 1 axlUSDC, not 1
  destinationContractAddress?: string;
  sourceContractAddress?: string;
  tokenSymbol?: string;
};
export type EstimateGasFeeParams = GetFeesParams & {
  gasLimit: BigInt;
  gasMultiplier: number;
  minGasPrice: string;
  gmpParams?: GMPParams;
};
