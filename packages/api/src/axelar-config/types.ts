export interface BaseAssetConfig {
  id: string;
  prettySymbol: string;
  symbol: string;
  sourceChainId_internal: string;
  sourceChainId_external: string | number;
  registrationType: "network_asset" | "interchain_token";
  name: string;
  decimals: number;
  svg: string;
  coingeckoId: string;
}

export interface ComosAssetConfig extends BaseAssetConfig {
  module: "axelarnet";
  fullDenomPath: string;
  ibcDenom: string;
}

export interface EVMAssetConfig extends BaseAssetConfig {
  module: "evm";
  tokenAddress: string;
}

export type Asset = ComosAssetConfig | EVMAssetConfig;

export interface BaseChainConfig {
  id: string;
  externalId: {
    chainId: string | number;
    chainName: string;
  };
  chainId_internal: string;
  assets: Asset[];
}

export interface AxelarEVMChainConfig extends BaseChainConfig {
  module: "evm";
  evmConfigs: {
    finalityHeight: number;
    contracts: {
      gasService: `0x${string}`;
      constAddressDeployer: `0x${string}`;
      depositService: `0x${string}`;
      gateway: `0x${string}`;
    };
  };
}

export interface AxelarCosmosChainConfig extends BaseChainConfig {
  module: "axelarnet";
  cosmosConfigs: {
    rpc: string[];
    lcd: string[];
    grpc: string[];
    addressPrefix: string;
    channelIdToAxelar: string;
  };
}

export type ChainConfig = AxelarCosmosChainConfig | AxelarEVMChainConfig;

export interface ChainConfigsResponse {
  chains: { [chainId: string]: ChainConfig };
  version: string;
  environment: string;
}
