import { GasToken } from "@axelar-network/axelarjs-sdk";

export type EstimateGasFeeParams = {
  sourceChainId: string;
  destinationChainId: string;
  sourceChainTokenSymbol: GasToken;
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
