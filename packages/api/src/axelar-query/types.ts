/* eslint-disable @typescript-eslint/no-duplicate-enum-values */
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

export enum EvmChain {
  ETHEREUM = "ethereum",
  AVALANCHE = "avalanche",
  FANTOM = "fantom",
  POLYGON = "polygon",
  POLYGON_ZKEVM = "polygon-zkevm",
  MOONBEAM = "moonbeam",
  AURORA = "aurora",
  BINANCE = "binance",
  BNBCHAIN = "binance",
  ARBITRUM = "arbitrum",
  ARBITRUM_SEPOLIA = "arbitrum-sepolia",
  CELO = "celo",
  KAVA = "kava",
  BASE = "base",
  FILECOIN = "filecoin",
  OPTIMISM = "optimism",
  LINEA = "linea",
  MANTLE = "mantle",
  SCROLL = "scroll",
  SEPOLIA = "ethereum-sepolia",
  IMMUTABLE = "immutable",
  CENTRIFUGE_TESTNET = "centrifuge-2",
  CENTRIFUGE = "centrifuge",
  FRAXTAL = "fraxtal",
  BLAST_SEPOLIA = "blast-sepolia",
  OPTIMISM_SEPOLIA = "optimism-sepolia",
  MANTLE_SEPOLIA = "mantle-sepolia",
  BASE_SEPOLIA = "base-sepolia",
  BLAST = "blast",
  POLYGON_SEPOLIA = "polygon-sepolia",
  LINEA_SEPOLIA = "linea-sepolia",
}

export enum GasToken {
  ETH = "ETH",
  AVAX = "AVAX",
  GLMR = "GLMR",
  FTM = "FTM",
  MATIC = "MATIC",
  USDC = "USDC",
  aUSDC = "aUSDC",
  axlUSDC = "axlUSDC",
  AURORA = "aETH",
  BINANCE = "BNB",
  BNBCHAIN = "BNB",
  CELO = "CELO",
  KAVA = "KAVA",
  BASE = "ETH",
  FILECOIN = "FIL",
  OSMO = "OSMO",
  AXL = "AXL",
  POLYGON_ZKEVM = "ETH",
  MANTLE = "MNT",
  SCROLL = "ETH",
  IMMUTABLE = "IMX",
  SEPOLIA = "ETH",
  ARBITRUM_SEPOLIA = "ETH",
  CENTRIFUGE = "CFG",
  FRAXTAL = "frxETH",
  BLAST_SEPOLIA = "ETH",
  OPTIMISM_SEPOLIA = "ETH",
  MANTLE_SEPOLIA = "ETH",
  BASE_SEPOLIA = "ETH",
  BLAST = "ETH",
  LINEA_SEPOLIA = "ETH",
}

type TokenUnit = {
  value: string;
  decimals: number;
};

export type FeeToken = {
  gas_price: string;
  decimals: number;
  name: string;
  l1_gas_oracle_address?: string;
  l1_gas_price_in_units?: TokenUnit;
  symbol: string;
  token_price: {
    usd: number;
  };
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
  baseFee: string;
  expressFee: string;
  sourceToken: NativeToken;
  executeGasMultiplier: number;
  destToken: {
    gas_price: string;
    decimals: number;
    token_price: TokenPrice;
    name: string;
    symbol: string;
    l1_gas_oracle_address?: string;
    l1_gas_price_in_units: GasPriceInUnits;
  };
  l2_type: "op" | "arb" | "mantle" | undefined;
  ethereumToken: BaseToken;
  apiResponse: AxelarGMPResponse;
  success: boolean;
  expressSupported: boolean;
}

export interface GetNativeGasBaseFeeOptions {
  sourceTokenSymbol?: GasToken;
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
}

export interface AxelarGMPResponse {
  result: AxelarGMPResult;
}

export interface GetNativeGasBaseFeeParams {
  method: string;
  destinationChain: EvmChain;
  sourceChain: EvmChain;
  sourceTokenSymbol: string | undefined;
  symbol: string | undefined;
  amount: number | undefined;
  amountInUnits: bigint | string | undefined;
  destinationContractAddress: string | undefined;
  sourceContractAddress: string | undefined;
}
