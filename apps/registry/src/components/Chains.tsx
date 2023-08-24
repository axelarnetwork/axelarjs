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
        .map((x: EVMChainConfig | CosmosChainConfig) => ({
          network: props.network,
          config: x,
        }))
        .map(({ config, network }: ChainItem<typeof props.network>) => (
          <>
            {network === "evm" && (
              <Card key={config.id} className="bg-base-200">
                <Card.Body>
                  <Card.Title $as="h1">
                    <Image
                      src={`${BASE_URL}/${config.iconUrl}`}
                      className="mr-2 h-6 w-6"
                      alt={`${config.name} icon`}
                      width={24}
                      height={24}
                    />

                    {config.name}
                  </Card.Title>

                  <pre>{JSON.stringify(config, null, 2)}</pre>
                </Card.Body>
              </Card>
            )}
            {network === "cosmos" && (
              <Card key={config.chainId} className="bg-base-200">
                <Card.Body>
                  <Card.Title $as="h1">
                    <Image
                      src={`${BASE_URL}/${config.chainIconUrl}`}
                      className="mr-2 h-6 w-6"
                      alt={`${config.chainName} icon`}
                      width={24}
                      height={24}
                    />

                    {config.chainName}
                  </Card.Title>

                  <pre>{JSON.stringify(config, null, 2)}</pre>
                </Card.Body>
              </Card>
            )}
          </>
        ))}
    </ul>
  );
};

export default Chains;
