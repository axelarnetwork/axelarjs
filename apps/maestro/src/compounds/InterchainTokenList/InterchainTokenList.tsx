import { FC, ReactNode } from "react";

import { Button, Card, CopyToClipboardButton } from "@axelarjs/ui";
import { maskAddress } from "@axelarjs/utils";
import clsx from "clsx";
import invariant from "tiny-invariant";
import { useAccount, useSwitchNetwork } from "wagmi";

import BigNumberText from "~/components/BigNumberText";
import { ChainIcon } from "~/components/EVMChainsDropdown";
import { useEVMChainConfigsQuery } from "~/services/axelarscan/hooks";
import { EVMChainConfig } from "~/services/axelarscan/types";
import { useGetERC20TokenBalanceForOwner } from "~/services/gmp/hooks";

export type InterchainTokenProps = {
  isRegistered: boolean;
  isOriginToken: boolean;
  tokenAddress: `0x${string}`;
  tokenId: `0x${string}`;
  chain: EVMChainConfig;
  onSwitchNetwork?: (chainId: number) => void;
};

export const InterchainToken: FC<InterchainTokenProps> = (props) => {
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
        "bg-base-200 dark:bg-base-300 transition-all",
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

export type InterchainTokenListProps = {
  title: ReactNode;
  tokens: {
    chainId: number;
    isRegistered: boolean;
    isOriginToken: boolean;
    tokenAddress: `0x${string}`;
    tokenId: `0x${string}`;
  }[];
};

export const InterchainTokenList: FC<InterchainTokenListProps> = (props) => {
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
