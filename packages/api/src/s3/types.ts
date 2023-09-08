export type Asset = {
  id: string;
  prettySymbol: string;
  symbol: string;
  sourceChainId_internal: string;
  sourceChainId_external: string | number;
  registrationType: "network_asset" | "interchain_token";
  name: string;
  decimals: number;
  svg: string;
  fullDenomPath: string;
  ibcDenom: string;
  coingeckoId: string;
};
export type ChainConfig = {
  id: string;
  externalIdentifiers: {
    chainId: string | number;
    chainName: string;
  };
  chainId_internal: string;
  assets: Asset[];
  module: "axelarnet" | "evm";
};

export type S3EVMChainConfig = ChainConfig & {
  evmConfigs: {
    finalityHeight: number;
    contracts: {
      gasService: `0x${string}`;
      constAddressDeployer: `0x${string}`;
      depositService: `0x${string}`;
      gateway: `0x${string}`;
    };
  };
};
export type S3CosmosChainConfig = ChainConfig & {
  cosmosConfigs: {
    rpc: string[];
    lcd: string[];
    grpc: string[];
    addressPrefix: string;
    channelIdToAxelar: string;
  };
};
