export type AxelarScanContract = {
  chain_id: number;
  contract_address: string;
  decimals: number;
  symbol: string;
};

export type IBCTokenMeta = {
  chain_id: string;
  decimals: number;
  ibc_denom: string;
};

export type AxelarScanAsset = {
  id: string;
  coingecko_id: string;
  decimals: number;
  image: string;
  name: string;
  symbol: string;
  price: number;
  contracts: AxelarScanContract[];
  ibc: IBCTokenMeta[];
};

export type AxelarAssetPrice = Pick<
  AxelarScanAsset,
  "price" | "coingecko_id" | "id"
> & {
  denom: string;
  price_timestamp: number;
  updated_at: number;
};

export type EVMChainConfig = {
  chain_id: number;
  chain_name: string;
  maintainer_id: string;
  deprecated: boolean;
  endpoints: {
    rpc: string[];
  };
  native_token: {
    name: string;
    symbol: string;
    decimals: number;
  };
  name: string;
  image: string;
  color: string;
  explorer: {
    name: string;
    url: string;
    icon: string;
    block_path: string;
    address_path: string;
    contract_path: string;
    contract_0_path: string;
    transaction_path: string;
  };
  id: string;
  chain_type: "evm";
  provider_params: [
    {
      chainId: string;
      chainName: string;
      rpcUrls: string[];
      nativeCurrency: {
        name: string;
        symbol: string;
        decimals: number;
      };
      blockExplorerUrls: string[];
    }
  ];
  gateway_address: string;
  no_inflation: boolean;
  no_tvl: boolean;
};

export type CosmosChainConfig = {
  chain_id?: number;
  chain_name: string;
  endpoints: {
    lcd: string[];
    timeout: {
      lcd: number;
    };
  };
  native_token: {
    name: string;
    symbol: string;
    decimals: string;
  };
  deprecated: boolean;
  name: string;
  short_name: string;
  image: string;
  color: string;
  explorer: {
    name: string;
    url: string;
    icon: string;
    block_path: string;
    address_path: string;
    contract_path: string;
    contract_0_path: string;
    transaction_path: string;
    asset_path: string;
  };
  prefix_address: string;
  prefix_chain_ids: string[];
  id: string;
  chain_type: "cosmos";
};
