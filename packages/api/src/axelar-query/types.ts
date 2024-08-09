/* eslint-disable @typescript-eslint/no-duplicate-enum-values */
import { QueryService as AxelarnetQS } from "@axelarjs/proto/axelar/axelarnet/v1beta1/service";
import { QueryService as EvmQS } from "@axelarjs/proto/axelar/evm/v1beta1/service";
import { QueryService as NexusQS } from "@axelarjs/proto/axelar/nexus/v1beta1/service";
import { QueryService as TSSQS } from "@axelarjs/proto/axelar/tss/v1beta1/service";

import type { QueryClient } from "@cosmjs/stargate";

import type { GetFeesParams } from "..";

export type EstimateGasFeeParams = GetFeesParams & {
  gasLimit: bigint;
  gasMultiplier?: number | "auto";
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

export type Environment = "devnet" | "testnet" | "mainnet";

export interface AxelarQueryClientConfig {
  axelarRpcUrl?: string;
  environment: Environment;
}

interface TokenPrice {
  usd: number;
}

interface GasPriceInUnits {
  value: string;
  decimals: number;
}

interface BaseToken {
  name: string;
  symbol: string;
  decimals: number;
  token_price: TokenPrice;
}

interface NativeToken extends BaseToken {
  contract_address: string;
  gas_price: string;
  gas_price_gwei: string;
  gas_price_in_units: GasPriceInUnits;
  l1_gas_oracle_address: string;
  l1_gas_price_in_units: GasPriceInUnits;
}

export interface BaseFeeResponse {
  success: boolean;
  error: unknown;
  baseFee?: string;
  expressFee?: string;
  sourceToken?: NativeToken;
  executeGasMultiplier?: number;
  destToken?: {
    gas_price: string;
    decimals: number;
    token_price: TokenPrice;
    name: string;
    symbol: string;
    l1_gas_oracle_address?: string;
    l1_gas_price_in_units: GasPriceInUnits;
  };
  l2_type?: "op" | "arb" | "mantle" | undefined;
  ethereumToken?: BaseToken;
  apiResponse?: AxelarGMPResponse;
  expressSupported?: boolean;
}

export interface GetNativeGasBaseFeeOptions {
  sourceTokenSymbol?: string;
  symbol?: string;
  destinationContractAddress?: string;
  sourceContractAddress?: string;
  amount?: number;
  amountInUnits?: bigint | string;
}

export interface AxelarGMPResult {
  source_base_fee_string: string;
  source_token: NativeToken;
  ethereum_token: BaseToken;
  destination_native_token: NativeToken;
  express_fee_string: string;
  express_supported: boolean;
  l2_type: "op" | "arb" | "mantle" | undefined;
  execute_gas_multiplier: number;
}

export interface AxelarGMPResponse {
  result: AxelarGMPResult;
}
export interface AxelarQueryService {
  readonly evm: EvmQS;
  readonly axelarnet: AxelarnetQS;
  readonly nexus: NexusQS;
  readonly tss: TSSQS;
}
export type AxelarQueryClientType = QueryClient & AxelarQueryService;
