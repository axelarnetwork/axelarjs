export const CHAIN_TABS = [
  {
    label: "EVM Chains",
    value: "evm",
  },
  {
    label: "Cosmos Chains",
    value: "cosmos",
  },
];

export type EVMChainConfig = {
  id: number;
  network: string;
  name: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
    iconUrl: string;
  };
  rpcUrls: string[];
  blockExplorers: {
    name: string;
    url: string;
  }[];
  iconUrl: string;
  testnet: boolean;
};

export type CosmosChainConfig = {
  rest: string;
  rpc: string;
  chainId: string;
  chainName: string;
  stakeCurrency: {
    coinDenom: string;
    coinMinimalDenom: string;
    coinDecimals: number;
  };
  bech32Config: {
    bech32PrefixAccAddr: string;
    bech32PrefixAccPub: string;
    bech32PrefixConsAddr: string;
    bech32PrefixConsPub: string;
    bech32PrefixValAddr: string;
    bech32PrefixValPub: string;
  };
  bip44: {
    coinType: number;
  };
  feeCurrencies: {
    coinDenom: string;
    coinMinimalDenom: string;
    coinDecimals: number;
  }[];
  currencies: {
    coinDenom: string;
    coinMinimalDenom: string;
    coinDecimals: number;
  }[];
};

export type NetworkKind = "evm" | "cosmos";

export type ChainItem<T extends NetworkKind> = T extends "evm"
  ? { network: "evm"; config: EVMChainConfig }
  : T extends "cosmos"
  ? { network: "cosmos"; config: CosmosChainConfig }
  : never;
