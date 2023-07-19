import type { GasTokenKind } from "@axelarjs/evm";

export type EstimateGasFeeParams = {
  sourceChainId: string;
  destinationChainId: string;
  sourceChainTokenSymbol: GasTokenKind;
  gasLimit?: number;
  gasMultipler?: number;
  minGasPrice?: string;
  isGMPExpressTransaction?: boolean;
};

export type EstimateGasFeeMultipleChainsParams = {
  sourceChainId: string;
  destinationChainIds: string[];
  gasLimit?: number;
  gasMultipler?: number;
  minGasPrice?: string;
  isGMPExpressTransaction?: boolean;
};
