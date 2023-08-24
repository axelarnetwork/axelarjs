import { Card } from "@axelarjs/ui/components/Card";
import { FC } from "react";
import Image from "next/image";

import {
  ChainItem,
  CosmosChainConfig,
  EVMChainConfig,
  NetworkKind,
} from "~/app/chains/_shared";

const BASE_URL =
  "https://raw.githubusercontent.com/axelarnetwork/public-chain-configs/main";

const chainsUrl = (network: "evm" | "cosmos") =>
  `${BASE_URL}/registry/${process.env.NEXT_PUBLIC_NETWORK_ENV}/${network}/chains.json`;

type ChainsProps = {
  network: NetworkKind;
};

const Chains: FC<ChainsProps> = async (props) => {
  const { chains } = await fetch(chainsUrl(props.network)).then((res) =>
    res.json()
  );

  return (
    <ul className="grid gap-4">
      {chains
        .map((config: EVMChainConfig | CosmosChainConfig) => ({
          network: props.network,
          config,
        }))
        .map(({ config, network }: ChainItem<typeof props.network>) => {
          const chain = getChainCardData({
            config,
            network,
          } as ChainItem<typeof props.network>);

          return (
            <Card key={chain.key} className="bg-base-200">
              <Card.Body>
                <Card.Title $as="h1">
                  <Image
                    src={`${BASE_URL}/${chain.iconUrl}`}
                    className="mr-2 h-6 w-6"
                    alt={`${chain.name} icon`}
                    width={24}
                    height={24}
                  />

                  {chain.name}
                </Card.Title>

                <ConfigSnippet config={config} />
              </Card.Body>
            </Card>
          );
        })}
    </ul>
  );
};

export default Chains;

const ConfigSnippet: FC<{
  config: EVMChainConfig | CosmosChainConfig;
}> = (props) => {
  return (
    <div className="flex-1">
      <pre>{JSON.stringify(props.config, null, 2)}</pre>
    </div>
  );
};

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
