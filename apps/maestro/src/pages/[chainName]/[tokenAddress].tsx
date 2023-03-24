import { FC } from "react";

import { Button, Card, CopyToClipboardButton } from "@axelarjs/ui";
import { maskAddress, Maybe, unSluggify } from "@axelarjs/utils";
import clsx from "clsx";
import { isAddress } from "ethers/lib/utils.js";
import Head from "next/head";
import { useRouter } from "next/router";
import { pluck } from "rambda";
import invariant from "tiny-invariant";
import { useNetwork, useSwitchNetwork } from "wagmi";

import { ChainIcon } from "~/components/EVMChainsDropdown";
import { AddErc20 } from "~/compounds";
import ConnectWalletButton from "~/compounds/ConnectWalletButton";
import { SendInterchainToken } from "~/compounds/SendInterchainToken";
import { useEVMChainConfigsQuery } from "~/services/axelarscan/hooks";
import { useInterchainTokensQuery } from "~/services/gmp/hooks";

type InterchainTokenProps = {
  isRegistered: boolean;
  isOriginToken: boolean;
  tokenAddress: `0x${string}`;
  chain: {
    chain_id: number;
    name: string;
    image: string;
  };
  onSwitchNetwork?: (chainId: number) => void;
};

const InterchainToken: FC<InterchainTokenProps> = (props) => {
  return (
    <Card
      compact
      key={props.chain.chain_id}
      bordered={!props.isRegistered}
      className={clsx(
        "bg-base- transition-all",
        "100 hover:ring-primary/50 hover:shadow-xl hover:ring",
        {
          "ring-primary/50 ring-2": props.isRegistered,
          "ring-success/50 ring-2": props.isOriginToken,
          "shadow-sm": !props.isRegistered,
        }
      )}
    >
      <Card.Body>
        <Card.Title className="justify-between">
          <span className="flex items-center gap-2">
            <ChainIcon
              src={props.chain.image}
              alt={props.chain.name}
              size="md"
            />
            {props.chain.name}
          </span>

          {props.isOriginToken ? (
            <span className="badge badge-success badge-outline">origin</span>
          ) : (
            props.isRegistered && (
              <span className="badge badge-info badge-outline">registered</span>
            )
          )}
        </Card.Title>

        {!props.isRegistered && (
          <div className="mx-auto px-2">Remote token not registered</div>
        )}
        <Card.Actions className="justify-between">
          {props.isRegistered ? (
            <CopyToClipboardButton
              copyText={props.tokenAddress}
              ghost
              length="block"
            >
              {maskAddress(props.tokenAddress)}
            </CopyToClipboardButton>
          ) : (
            <Button
              size="sm"
              color="primary"
              length="block"
              onClick={props.onSwitchNetwork?.bind(null, props.chain.chain_id)}
            >
              Switch to {props.chain.name}
            </Button>
          )}
        </Card.Actions>
      </Card.Body>
    </Card>
  );
};

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

  const { switchNetworkAsync } = useSwitchNetwork();

  return Maybe.of(evmChains).mapOrNull((chains) => (
    <ul className="grid w-full grid-cols-3 gap-4">
      {chains
        .map(
          (chain) =>
            [
              chain,
              interchainToken?.matchingTokens?.find(
                ({ chainId }) => chainId === chain.chain_id
              ),
            ] as const
        )
        .filter(([, token]) => Boolean(token))
        .map(([chain, token]) => {
          invariant(token, "token should be defined");

          return (
            <InterchainToken
              key={chain.chain_id}
              isRegistered={token.isRegistered}
              isOriginToken={token.isOriginToken}
              tokenAddress={token.tokenAddress}
              chain={chain}
              onSwitchNetwork={switchNetworkAsync}
            />
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
  const { data, isFetching, error, isFetched } = useInterchainTokensQuery({
    chainId: chain?.id,
    tokenAddress: tokenAddress as `0x${string}`,
  });

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
      <div className="flex w-full justify-end">
        <AddErc20
          trigger={
            <Button size="sm" className="max-w-sm">
              Deploy on other chains
            </Button>
          }
          tokenAddress={tokenAddress}
        />
        <SendInterchainToken
          trigger={
            <Button size="sm" className="ml-2 max-w-sm">
              Send token interchain [WIP]
            </Button>
          }
          tokenAddress={tokenAddress}
          tokenId={data.tokenId as `0x${string}`}
        />
      </div>
      <ConnectedInterchainTokensPage
        chainName={chainName}
        tokenAddress={tokenAddress}
      />
    </div>
  );
};
export default InterchainTokensPage;
