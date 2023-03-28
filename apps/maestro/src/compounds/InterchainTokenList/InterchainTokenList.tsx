import { FC, ReactNode, useMemo } from "react";

import { Button, Card, CopyToClipboardButton } from "@axelarjs/ui";
import { maskAddress } from "@axelarjs/utils";
import clsx from "clsx";
import { BigNumber } from "ethers";
import { useAccount } from "wagmi";

import BigNumberText from "~/components/BigNumberText";
import { ChainIcon } from "~/components/EVMChainsDropdown";
import { EVMChainConfig } from "~/services/axelarscan/types";
import { useGetERC20TokenBalanceForOwner } from "~/services/gmp/hooks";

type TokenInfo = {
  chainId: number;
  isRegistered: boolean;
  isOriginToken: boolean;
  tokenAddress: `0x${string}`;
  tokenId: `0x${string}`;
  isSelected?: boolean;
  chain?: EVMChainConfig;
};

export type InterchainTokenProps = TokenInfo & {
  onToggleSelection?: () => void;
};

export const InterchainToken: FC<InterchainTokenProps> = (props) => {
  const { address } = useAccount();
  const { data: balance } = useGetERC20TokenBalanceForOwner({
    chainId: props.chainId,
    tokenLinkerTokenId: props.tokenId,
    owner: address,
  });
  return (
    <Card
      compact={true}
      key={props.chainId}
      bordered={!props.isRegistered}
      onClick={props.onToggleSelection}
      className={clsx(
        "bg-base-200 dark:bg-base-300 transition-all ease-in",
        "hover:opacity-75 hover:shadow-xl",
        {
          "shadow-sm": !props.isRegistered,
          "ring-primary/50 ring-4": props.isSelected,
          "cursor-pointer": props.onToggleSelection,
        }
      )}
      aria-label={
        props.onToggleSelection ? "click to toggle token selection" : undefined
      }
      aria-selected={props.isSelected}
      $as={props.onToggleSelection ? "button" : undefined}
      role={props.onToggleSelection ? "switch" : undefined}
    >
      <Card.Body className="w-full">
        <Card.Title className="justify-between">
          {props.chain && (
            <span className="flex items-center gap-2">
              <ChainIcon
                src={props.chain.image}
                alt={props.chain.name}
                size="md"
              />
              {props.chain.name}
            </span>
          )}

          {props.isOriginToken ? (
            <span className="badge badge-success badge-outline">origin</span>
          ) : (
            props.isRegistered && (
              <span className="badge badge-info badge-outline">registered</span>
            )
          )}
        </Card.Title>
        {!props.isRegistered && (
          <div className="mx-auto">Remote token not registered</div>
        )}
        {balance?.tokenBalance && (
          <div className="flex items-center justify-between">
            <div>
              Balance:{" "}
              <BigNumberText
                decimals={balance.decimals}
                localeOptions={{
                  minimumFractionDigits: 0,
                  notation: "compact",
                }}
              >
                {balance.tokenBalance}
              </BigNumberText>
            </div>
            {BigNumber.from(balance.tokenBalance).gt(0) && (
              <Button size="xs" color="primary">
                Send
              </Button>
            )}
          </div>
        )}
        <Card.Actions className="justify-between">
          {props.isRegistered && (
            <CopyToClipboardButton
              copyText={props.tokenAddress}
              ghost={true}
              length="block"
              size="sm"
            >
              {maskAddress(props.tokenAddress)}
            </CopyToClipboardButton>
          )}
        </Card.Actions>
      </Card.Body>
    </Card>
  );
};

export type InterchainTokenListProps = {
  title: ReactNode;
  tokens: TokenInfo[];
  onToggleSelection?: (chainId: number) => void;
  footer?: ReactNode;
};

export const InterchainTokenList: FC<InterchainTokenListProps> = (props) => {
  const tokens = useMemo(
    () =>
      props.tokens
        .filter((x) => x.chain)
        .sort((a, b) =>
          // sort by origin token ascending
          a?.isOriginToken ? -1 : b?.isOriginToken ? 1 : 0
        ),
    [props.tokens]
  );

  return (
    <section className="relative grid gap-4">
      <header className="flex items-center gap-2 text-2xl">
        <span className="font-bold">{props.title}</span>
        <span className="font-mono text-xl opacity-50">
          ({props.tokens.length})
        </span>
      </header>
      <main>
        <ul className="grid w-full grid-cols-3 gap-4">
          {tokens.map((token) => (
            <InterchainToken
              key={token.chainId}
              onToggleSelection={props.onToggleSelection?.bind(
                null,
                token.chainId
              )}
              {...token}
            />
          ))}
        </ul>
      </main>
      {props.footer && <footer>{props.footer}</footer>}
    </section>
  );
};
