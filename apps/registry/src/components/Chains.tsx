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
  search?: string;
};

const Chains: FC<ChainsProps> = async (props) => {
  const { chains } = await fetch(chainsUrl(props.network)).then((res) =>
    res.json()
  );

  const filteredChains = (
    (chains ?? []) as (EVMChainConfig | CosmosChainConfig)[]
  )
    .filter((config) => {
      if (!props.search) return true;

      const search = props.search.toLowerCase();

      const field = "name" in config ? config.name : config.chainName;

      return field.toLowerCase().includes(search);
    })
    .map(
      (config) =>
        ({
          network: props.network,
          config,
        } as ChainItem<typeof props.network>)
    )
    .sort((a, b) => {
      const aName = "name" in a.config ? a.config.name : a.config.chainName;
      const bName = "name" in b.config ? b.config.name : b.config.chainName;

      return aName.localeCompare(bName);
    });

  return (
    <ul className="grid gap-4">
      {filteredChains.map(
        ({ config, network }: ChainItem<typeof props.network>) => {
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
        }
      )}
    </ul>
  );
};

export default Chains;

const ConfigSnippet: FC<{
  config: EVMChainConfig | CosmosChainConfig;
}> = (props) => {
  const content = JSON.stringify(props.config, null, 2);

  return (
    <details className="collapse">
      <summary className="collapse-title">
        <span className="flex items-center gap-2">Full config</span>
      </summary>
      <div className="collapse-content">
        <div className="mockup-code">
          <pre className="max-w-xs lg:max-w-lg">{content}</pre>
        </div>
      </div>
    </details>
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
