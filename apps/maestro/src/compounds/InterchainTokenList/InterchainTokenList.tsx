import { FC, ReactNode, useMemo } from "react";

import {
  Badge,
  Button,
  Card,
  CopyToClipboardButton,
  SpinnerIcon,
} from "@axelarjs/ui";
import { maskAddress } from "@axelarjs/utils";
import clsx from "clsx";
import { useAccount, useNetwork } from "wagmi";

import BigNumberText from "~/components/BigNumberText";
import { ChainIcon } from "~/components/EVMChainsDropdown";
import { EVMChainConfig } from "~/services/axelarscan/types";
import { useGetERC20TokenBalanceForOwnerQuery } from "~/services/gmp/hooks";
import { GMPStatus } from "~/services/gmp/types";

import { SendInterchainToken } from "../SendInterchainToken";

type TokenInfo = {
  chainId: number;
  isRegistered: boolean;
  isOriginToken: boolean;
  tokenAddress: `0x${string}`;
  tokenId: `0x${string}`;
  isSelected?: boolean;
  chain?: EVMChainConfig;
  deploymentStatus?: "pending" | GMPStatus;
};

export type InterchainTokenProps = TokenInfo & {
  onToggleSelection?: () => void;
};

export const InterchainToken: FC<InterchainTokenProps> = (props) => {
  const { address } = useAccount();
  const { chain } = useNetwork();
  const { data: balance } = useGetERC20TokenBalanceForOwnerQuery({
    chainId: props.chainId,
    tokenLinkerTokenId: props.tokenId,
    owner: address,
  });

  const isSourceChain = chain?.id === props.chainId;

  return (
    <Card
      compact={true}
      key={props.chainId}
      bordered={!props.isRegistered}
      onClick={!props.deploymentStatus ? props.onToggleSelection : undefined}
      className={clsx(
        "bg-base-200 dark:bg-base-300 transition-all ease-in",
        "hover:opacity-75 hover:shadow-xl",
        {
          "shadow-sm": !props.isRegistered,
          "cursor-pointer": props.onToggleSelection,
          "ring-primary/50 !bg-primary/25 dark:!bg-primary/10 ring-4":
            props.isSelected,
        }
      )}
      aria-label={
        props.onToggleSelection ? "click to toggle token selection" : undefined
      }
      aria-selected={props.isSelected}
      $as={
        props.onToggleSelection && !props.deploymentStatus
          ? "button"
          : undefined
      }
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
            <Badge outline color="success">
              origin
            </Badge>
          ) : (
            props.isRegistered && (
              <Badge outline color="info">
                registered
              </Badge>
            )
          )}
          {props.deploymentStatus && (
            <Badge
              outline
              color="warning"
              className="flex items-center gap-0.5"
            >
              <span className="-translate-x-1">
                <SpinnerIcon className="text-info h-2.5 w-2.5 animate-spin" />
              </span>
              <span className="-translate-y-px">{props.deploymentStatus}</span>
            </Badge>
          )}
        </Card.Title>
        {!props.isRegistered && (
          <div className="mx-auto">Remote token not registered</div>
        )}
        {balance?.tokenBalance && (
          <div
            className={clsx(
              "bg-base-300 dark:bg-base-100 flex items-center justify-between rounded-xl p-2 pl-4"
            )}
          >
            {balance.tokenBalance === "0" ? (
              <span className="mx-auto">No balance</span>
            ) : (
              <>
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
                {isSourceChain && (
                  <SendInterchainToken
                    trigger={
                      <Button size="xs" color="primary">
                        Send
                      </Button>
                    }
                    tokenAddress={props.tokenAddress}
                    tokenId={props.tokenId}
                    sourceChain={props.chain as EVMChainConfig}
                    balance={balance}
                  />
                )}
              </>
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
              className="bg-base-300 dark:bg-base-100"
            >
              {maskAddress(props.tokenAddress, {
                segmentA: 14,
                segmentB: -10,
              })}
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

  const selectedTokens = tokens.filter((x) => x.isSelected);

  return (
    <section className="relative grid gap-4">
      <header className="flex items-center justify-between gap-2 text-2xl">
        <div className="flex items-center gap-2">
          <span className="font-bold">{props.title}</span>
          <span className="font-mono text-xl opacity-50">
            ({tokens.length})
          </span>
        </div>
        {tokens.length > 0 && Boolean(props.onToggleSelection) && (
          <Button
            size="sm"
            color="primary"
            disabled={Boolean(
              // disable if all tokens are selected or none are selected
              selectedTokens.length && selectedTokens.length !== tokens.length
            )}
            onClick={() => {
              tokens.forEach((token, i) => {
                setTimeout(() => {
                  props.onToggleSelection?.(token.chainId);
                }, i * 25);
              });
            }}
          >
            Toggle All
          </Button>
        )}
      </header>
      <main>
        <ul className="grid w-full grid-cols-3 gap-4 md:gap-5">
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
