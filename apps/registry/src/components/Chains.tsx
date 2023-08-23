import { FC } from "react";
import Image from "next/image";

const chainsUrl = (network: "evm" | "cosmos") =>
  `https://raw.githubusercontent.com/axelarnetwork/public-chain-configs/main/registry/${process.env.NEXT_PUBLIC_NETWORK_ENV}/${network}/chains.json`;

/**
 // sample chain

 {
  "id": 5,
  "network": "goerli",
  "name": "Goerli",
  "nativeCurrency": {
    "name": "Goerli Ether",
    "symbol": "ETH",
    "decimals": 18,
    "iconUrl": "/images/tokens/eth.svg"
  },
  "rpcUrls": [
    "https://rpc.ankr.com/eth_goerli"
  ],
  "blockExplorers": [
    {
      "name": "Etherscan",
      "url": "https://goerli.etherscan.io"
    }
  ],
  "iconUrl": "/images/chains/ethereum.svg",
  "testnet": true
}

 */

type ChainItem = {
  id: number;
  network: string;
  name: string;
  iconUrl: string;
};

const Chains: FC<{
  network: "evm" | "cosmos";
}> = async ({ network }) => {
  const response = await fetch(chainsUrl(network));

  const body = await response.json();

  return (
    <ul className="grid gap-4">
      {body.chains.map((x: ChainItem) => (
        <li key={x.id} className="card bg-base-300">
          <div className="card-body">
            <h1 className="card-title">
              <Image
                src={`https://raw.githubusercontent.com/axelarnetwork/public-chain-configs/main/${x.iconUrl}`}
                className="mr-2 h-6 w-6"
                alt={`${x.name} icon`}
                width={24}
                height={24}
              />

              {x.name}
            </h1>

            <pre>{JSON.stringify(x, null, 2)}</pre>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default Chains;
