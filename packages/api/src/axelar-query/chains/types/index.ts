import type { Environment } from "@axelarjs/cosmos";

export interface ChainInfo {
  id: string;
  assets: AssetInfo[];
  chainSymbol: string;
  chainName: string;
  fullySupported: boolean;
  estimatedWaitTime: number;
  txFeeInPercent: number;
  module: "axelarnet" | "evm";
  confirmLevel?: number;
  chainIdentifier: {
    devnet: string;
    testnet: string;
    mainnet: string;
  };
  nativeAsset: string[];
  addressPrefix: string;
  channelIdToAxelar?: string;
}

export type LoadChainConfig = {
  environment: Environment;
};

export interface AssetInfo {
  assetSymbol?: string;
  assetName?: string;
  assetAddress?: string;
  common_key?: string;
  fullDenomPath?: string;
  fullySupported?: boolean;
  native_chain?: string;
  minDepositAmt?: number;
  decimals?: number;
  ibcDenom?: string;
  tokenAddress?: string;
}

export interface AssetInfoForChain extends AssetInfo {
  minDepositAmt: number;
}

export interface AssetConfig {
  id: string;
  common_key: { [env: string]: string };
  native_chain: string;
  fully_supported: boolean;
  decimals: number;
  chain_aliases: { [key: string]: AssetInfoForChain };
  wrapped_erc20: string;
  is_gas_token: boolean;
}
