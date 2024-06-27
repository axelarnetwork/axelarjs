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
    },
  ];
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

export type LinkEvent = {
  type: "link";
  attributes: [
    { key: "module"; value: string },
    { key: "sourceChain"; value: string },
    {
      key: "depositAddress";
      value: string;
    },
    { key: "destinationChain"; value: string },
    {
      key: "destinationAddress";
      value: string;
    },
    { key: "asset"; value: string },
  ];
};
export type MessageEvent = {
  type: "message";
  attributes: [{ key: "action"; value: "Link" }];
};
export type LinkRequestRawResponse = {
  data: [
    {
      height: number;
      txhash: string;
      codespace: string;
      code: number;
      logs: [
        {
          msg_index: number;
          log: string;
          events: (LinkEvent | MessageEvent)[];
        },
      ];
      info: string;
      gas_wanted: string;
      gas_used: string;
      tx: {
        body: {
          messages: [
            {
              "@type": "/axelar.axelarnet.v1beta1.LinkRequest";
              sender: string;
              recipient_addr: string;
              recipient_chain: string;
              denom: string;
            },
          ];
          memo: string;
          timeout_height: string;
        };
      };
      timestamp: number;
      addresses: string[];
      types: string[];
      id: string;
    },
  ];
  total: number;
  time_spent: number;
};

export type LinkRequestResponse = {
  sourceChain: string | undefined;
  destinationChain: string | undefined;
  destinationAddress: string | undefined;
  module: string | undefined;
  asset: string | undefined;
  depositAddress: string | undefined;
  txHash: string;
  tokenAddress?: string | undefined;
  timestamp?: number;
};

export type BaseChainConfigsResponse = {
  evm: EVMChainConfig[];
  cosmos: CosmosChainConfig[];
};

export type SearchBatchesData = {
  data: string;
  command_ids: string[];
  batch_id: string;
  id: string;
  status: string;
  execute_data: string;
  chain: string;
  commands: SearchBatchesCommands[];
};

export type SearchBatchesCommands = {
  executed: boolean;
  id: string;
  transactionHash: string;
  type: string;
};

export type SearchBatchesResponse = {
  data: SearchBatchesData[];
};
