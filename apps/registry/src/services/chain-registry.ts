export const BASE_URL =
  "https://raw.githubusercontent.com/axelarnetwork/public-chain-configs/main";

export type NetworkKind = "evm" | "cosmos";

const chainsUrl = (network: NetworkKind) =>
  `${BASE_URL}/registry/${process.env.NEXT_PUBLIC_NETWORK_ENV}/${network}/chains.json`;

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
    coinImageUrl: string;
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
    coinImageUrl: string;
  }[];
  currencies: {
    coinDenom: string;
    coinMinimalDenom: string;
    coinDecimals: number;
    coinImageUrl: string;
  }[];
  chainIconUrl: string;
};

export type ChainItem<T extends NetworkKind> = T extends "evm"
  ? { network: "evm"; config: EVMChainConfig }
  : T extends "cosmos"
  ? { network: "cosmos"; config: CosmosChainConfig }
  : never;

export async function getNormalizedChainConfigs({
  network = "evm" as NetworkKind,
  search = "",
}) {
  const url = chainsUrl(network);
  const res = await fetch(url, { next: { revalidate: 60 } });
  const { chains } = ((await res.json()) ?? {}) as {
    chains: (EVMChainConfig | CosmosChainConfig)[];
  };

  return (chains ?? [])
    .map(
      (config) =>
        ({
          network,
          config,
        } as ChainItem<typeof network>)
    )
    .map((chain) => ({
      ...chain,
      data: getChainCardData(chain),
    }))
    .filter(({ data }) => {
      if (!search) return true;
      return data.name.toLowerCase().includes(search.toLowerCase());
    })
    .sort((a, b) => {
      const aName = "name" in a.config ? a.config.name : a.config.chainName;
      const bName = "name" in b.config ? b.config.name : b.config.chainName;

      return aName.localeCompare(bName);
    });
}

function getChainCardData({ config, network }: ChainItem<NetworkKind>) {
  switch (network) {
    case "evm":
      return {
        key: String(config.id),
        name: config.name,
        iconUrl: config.iconUrl,
      };
    case "cosmos":
      return {
        key: config.chainId,
        name: config.chainName,
        iconUrl: config.chainIconUrl,
      };
  }
}
