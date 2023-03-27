import { FC, ReactNode } from "react";

import { Button, Card, CopyToClipboardButton, Tooltip } from "@axelarjs/ui";
import { maskAddress, Maybe, unSluggify } from "@axelarjs/utils";
import clsx from "clsx";
import { isAddress } from "ethers/lib/utils.js";
import { useRouter } from "next/router";
import { partition } from "rambda";
import invariant from "tiny-invariant";
import { useAccount, useSwitchNetwork } from "wagmi";

import BigNumberText from "~/components/BigNumberText";
import { ChainIcon } from "~/components/EVMChainsDropdown";
import { AddErc20 } from "~/compounds";
import { SendInterchainToken } from "~/compounds/SendInterchainToken";
import Page from "~/layouts/Page";
import { useChainFromRoute } from "~/lib/hooks";
import { useEVMChainConfigsQuery } from "~/services/axelarscan/hooks";
import { EVMChainConfig } from "~/services/axelarscan/types";
import {
  useGetERC20TokenBalanceForOwner,
  useInterchainTokensQuery,
} from "~/services/gmp/hooks";

const InterchainTokensPage = () => {
  const { chainName, tokenAddress } = useRouter().query as {
    chainName: string;
    tokenAddress: string;
  };

  const routeChain = useChainFromRoute();

  const { data: interchainToken } = useInterchainTokensQuery({
    chainId: routeChain?.id,
    tokenAddress: tokenAddress as `0x${string}`,
  });

  if (!isAddress(tokenAddress)) {
    return <div>Invalid token address</div>;
  }

  return (
    <Page
      pageTitle={`Interchain Tokens - ${unSluggify(chainName)}`}
      mustBeConnected
    >
      <div>
        <div className="flex items-center gap-2">
          Interchain Token Home Address{" "}
          <CopyToClipboardButton copyText={tokenAddress} size="sm" ghost={true}>
            {tokenAddress}
          </CopyToClipboardButton>{" "}
        </div>
        <div className="flex items-center gap-2">
          Token ID{" "}
          <Tooltip
            className="z-20"
            tip={
              "The Token ID is an internal identifier used to correlate all instances of an ERC-20 token across all supported chains" ||
              ""
            }
          >
            <CopyToClipboardButton
              copyText={interchainToken.tokenId}
              size="sm"
              ghost={true}
            >
              {interchainToken.tokenId}
            </CopyToClipboardButton>{" "}
          </Tooltip>
        </div>
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
          tokenId={interchainToken.tokenId as `0x${string}`}
        />
      </div>
      <ConnectedInterchainTokensPage
        chainId={routeChain?.id}
        tokenAddress={tokenAddress}
      />
    </Page>
  );
};

export default InterchainTokensPage;

type InterchainTokenProps = {
  isRegistered: boolean;
  isOriginToken: boolean;
  tokenAddress: `0x${string}`;
  tokenId: `0x${string}`;
  chain: EVMChainConfig;
  onSwitchNetwork?: (chainId: number) => void;
};

const InterchainToken: FC<InterchainTokenProps> = (props) => {
  const { address } = useAccount();
  const { data: balance } = useGetERC20TokenBalanceForOwner({
    chainId: props.chain.chain_id,
    tokenLinkerTokenId: props.tokenId,
    owner: address,
  });
  return (
    <Card
      compact={true}
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
        {balance?.tokenBalance && (
          <div>
            Balance:{" "}
            <BigNumberText
              decimals={balance.decimals}
              localeOptions={{ minimumFractionDigits: 0, notation: "compact" }}
            >
              {balance.tokenBalance}
            </BigNumberText>
          </div>
        )}
        <Card.Actions className="justify-between">
          {props.isRegistered ? (
            <CopyToClipboardButton
              copyText={props.tokenAddress}
              ghost={true}
              length="block"
              size="sm"
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

type InterchainTokenListProps = {
  title: ReactNode;
  tokens: {
    chainId: number;
    isRegistered: boolean;
    isOriginToken: boolean;
    tokenAddress: `0x${string}`;
    tokenId: `0x${string}`;
  }[];
};

const InterchainTokenList: FC<InterchainTokenListProps> = (props) => {
  const { data: evmChains } = useEVMChainConfigsQuery();
  const { switchNetworkAsync } = useSwitchNetwork();

  return (
    <section className="grid gap-4">
      <h2 className="text-2xl font-bold">{props.title}</h2>
      <ul className="grid w-full grid-cols-3 gap-4">
        {evmChains
          ?.map(
            (chain) =>
              [
                chain,
                props.tokens?.find(({ chainId }) => chainId === chain.chain_id),
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
                tokenId={token.tokenId}
              />
            );
          })}
      </ul>
    </section>
  );
};

type ConnectedInterchainTokensPageProps = {
  chainId?: number;
  tokenAddress: `0x${string}`;
};

const ConnectedInterchainTokensPage: FC<ConnectedInterchainTokensPageProps> = (
  props
) => {
  const { data: interchainToken } = useInterchainTokensQuery({
    chainId: props.chainId,
    tokenAddress: props.tokenAddress as `0x${string}`,
  });

  const [registered, unregistered] = Maybe.of(
    interchainToken?.matchingTokens
  ).mapOr(
    [[], []],
    partition((x) => x.isRegistered)
  );

  return (
    <div className="grid gap-8">
      <InterchainTokenList
        title="registered interchain tokens"
        tokens={registered}
      />
      <InterchainTokenList
        title="unregistered interchain tokens"
        tokens={unregistered}
      />
    </div>
  );
};
