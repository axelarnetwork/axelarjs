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
  id: string;
  maintainer_id: string;
  chain_name: string;
  name: string;
  short_name: string;
  chain_id: number;
  is_staging?: boolean;
  provider_params: Array<{
    chainId: string;
    chainName: string;
    rpcUrls: string[];
    nativeCurrency: {
      name: string;
      symbol: string;
      decimals: number;
    };
    blockExplorerUrls: string[];
  }>;
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
  image: string;
  color: string;
  website: string;
  gateway_address: string;
  deprecated: boolean;
  no_inflation: boolean;
};

export type CosmosChainConfig = {
  chain_name: string;
  coingecko_id: string;
  color: string;
  id: string;
  image: string;
  name: string;
  prefix_address: string;
  short_name: string;
  website: string;
  prefix_chain_ids: string[];
  is_staging?: boolean;
  endpoints: {
    lcds: string[];
  };
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
};
