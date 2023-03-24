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
            <Card
              compact
              key={chain.chain_id}
              className={clsx(
                "bg-base-200 hover:ring-primary/50 transition-all hover:shadow-xl hover:ring",
                {
                  "ring-primary/50 ring-2": token.isRegistered,
                  "ring-success/50 ring-2": token.isOriginToken,
                }
              )}
            >
              <Card.Body>
                <Card.Title className="justify-between">
                  <span className="flex items-center">
                    <ChainIcon src={chain.image} alt={chain.name} size="md" />
                    {chain.name}
                  </span>

                  {token.isOriginToken ? (
                    <span className="badge badge-success">origin token</span>
                  ) : (
                    token.isRegistered && (
                      <span className="badge badge-secondary">registered</span>
                    )
                  )}
                </Card.Title>
                <Card.Actions className="justify-between">
                  {token.isRegistered ? (
                    <CopyToClipboardButton
                      size="sm"
                      copyText={token.tokenAddress}
                      ghost
                    >
                      {maskAddress(token.tokenAddress)}
                    </CopyToClipboardButton>
                  ) : (
                    <Button
                      size="sm"
                      color="primary"
                      onClick={switchNetworkAsync?.bind(null, chain.chain_id)}
                    >
                      Switch to {chain.name}
                    </Button>
                  )}
                </Card.Actions>
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
      <AddErc20
        trigger={
          <Button size="sm" className="mb-5 w-full max-w-sm">
            Deploy on other chains
          </Button>
        }
        tokenAddress={tokenAddress}
      />
      <ConnectedInterchainTokensPage
        chainName={chainName}
        tokenAddress={tokenAddress}
      />
    </div>
  );
};
export default InterchainTokensPage;
