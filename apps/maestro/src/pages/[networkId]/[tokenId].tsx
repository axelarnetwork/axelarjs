import { Card } from "@axelarjs/ui";
import { Maybe } from "@axelarjs/utils";
import Head from "next/head";

import { useEVMChainConfigsQuery } from "~/services/axelarscan/hooks";

const InterchainTokensPage = () => {
  const { data: evmChains } = useEVMChainConfigsQuery();

  return (
    <div>
      <Head>
        <title>Interchain Tokens</title>
      </Head>
      <div>Interchain Tokens Page</div>

      {Maybe.of(evmChains).mapOrNull((chains) => (
        <ul>
          {chains.map((chain) => (
            <Card key={chain.chain_id}>
              <Card.Body>
                <Card.Title>{chain.name}</Card.Title>
                <div>{chain.chain_id}</div>
              </Card.Body>
            </Card>
          ))}
        </ul>
      ))}
    </div>
  );
};
export default InterchainTokensPage;
