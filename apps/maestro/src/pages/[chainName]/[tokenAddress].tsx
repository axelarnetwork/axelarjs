import { FC } from "react";

import { Card, CopyToClipboardButton } from "@axelarjs/ui";
import { Maybe, unSluggify } from "@axelarjs/utils";
import clsx from "clsx";
import { isAddress } from "ethers/lib/utils.js";
import Head from "next/head";
import { useRouter } from "next/router";
import { pluck } from "rambda";
import { useNetwork } from "wagmi";

import { ChainIcon } from "~/components/EVMChainsDropdown";
import ConnectWalletButton from "~/compounds/ConnectWalletButton";
import { useEVMChainConfigsQuery } from "~/services/axelarscan/hooks";
import { useInterchainTokensQuery } from "~/services/gmp/hooks";

type ConnectedInterchainTokensPageProps = {
  chainName: string;
  tokenAddress: `0x${string}`;
};

const ConnectedInterchainTokensPage: FC<ConnectedInterchainTokensPageProps> = (
  props
) => {
  const { data: evmChains } = useEVMChainConfigsQuery();

  const { chain } = useNetwork();

  const { data: interchainToken } = useInterchainTokensQuery({
    chainId: chain?.id,
    tokenAddress: props.tokenAddress as `0x${string}`,
  });

  return Maybe.of(evmChains).mapOrNull((chains) => (
    <ul className="grid w-full grid-cols-3 gap-4">
      {chains.map((chain) => {
        const matchingToken = interchainToken?.matchingTokens?.find(
          (t) => t.chainId === chain.chain_id
        );
        return (
          <Card
            key={chain.chain_id}
            className={clsx(
              "bg-base-200 hover:ring-primary/50 transition-all hover:ring",
              {
                "ring-primary/50 ring": matchingToken?.isRegistered,
                "ring-accent/50 ring": matchingToken?.isOriginToken,
              }
            )}
            bordered
          >
            <Card.Body>
              <Card.Title>
                <ChainIcon src={chain.image} alt={chain.name} size="md" />
                {chain.name}
              </Card.Title>
              <div>{chain.chain_id}</div>
            </Card.Body>
          </Card>
        );
      })}
    </ul>
  ));
};

const InterchainTokensPage = () => {
  const { data: evmChains } = useEVMChainConfigsQuery();

  const { chain, chains } = useNetwork();

  const { chainName, tokenAddress } = useRouter().query as {
    chainName: string;
    tokenAddress: string;
  };

  const routeChain = chains.find((c) => c.name === unSluggify(chainName));

  const chainIds = Maybe.of(evmChains).mapOr([], pluck("chain_id"));

  if (routeChain && !chainIds.includes(routeChain?.id)) {
    return <div>Chain not supported</div>;
  }

  if (!chain) {
    return (
      <div className="grid flex-1 place-items-center">
        <ConnectWalletButton size="lg" length="block" className="max-w-md" />
      </div>
    );
  }

  if (!isAddress(tokenAddress)) {
    return <div>Invalid token address</div>;
  }

  return (
    <div className="flex w-full flex-col gap-8">
      <Head>
        <title>Interchain Tokens - {unSluggify(chainName)}</title>
      </Head>
      <div className="flex items-center gap-2">
        Interchain Token{" "}
        <CopyToClipboardButton copyText={tokenAddress} size="sm" ghost>
          {tokenAddress}
        </CopyToClipboardButton>{" "}
      </div>

      <ConnectedInterchainTokensPage
        chainName={chainName}
        tokenAddress={tokenAddress}
      />
    </div>
  );
};
export default InterchainTokensPage;
