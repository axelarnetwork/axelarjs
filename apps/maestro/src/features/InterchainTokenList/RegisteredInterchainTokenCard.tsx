import type { EVMChainConfig } from "@axelarjs/api/axelarscan";
import {
  Badge,
  Button,
  Card,
  cn,
  CopyToClipboardButton,
  InfoIcon,
  SettingsIcon,
  SpinnerIcon,
  Tooltip,
} from "@axelarjs/ui";
import { toast } from "@axelarjs/ui/toaster";
import { maskAddress } from "@axelarjs/utils";
import { useCallback, useMemo, type FC } from "react";
import Link from "next/link";

import { TransactionExecutionError } from "viem";
import { useAccount, useChainId, useSwitchChain } from "wagmi";

import { shouldDisableSend } from "~/config/env";
import { useInterchainTokenBalanceForOwnerQuery } from "~/services/interchainToken/hooks";
import BigNumberText from "~/ui/components/BigNumberText";
import { ChainIcon } from "~/ui/components/EVMChainsDropdown";
import { AcceptInterchainTokenOwnership } from "../AcceptInterchainTokenOwnership";
import ManageInterchainToken from "../ManageInterchainToken/ManageInterchainToken";
import { SendInterchainToken } from "../SendInterchainToken";
import type { TokenInfo } from "./types";

const StatusIndicator: FC<Pick<TokenInfo, "isOriginToken" | "isRegistered">> = (
  props
) => {
  if (!props.isRegistered && !props.isOriginToken) {
    return null;
  }

  const tip = props.isOriginToken ? "origin token" : "registered";

  return (
    <Tooltip tip={tip} aria-label={tip} position="left">
      <Badge size="sm" variant={props.isOriginToken ? "success" : "info"} />
    </Tooltip>
  );
};

export type Props = TokenInfo & {
  hasRemoteTokens: boolean;
  originTokenAddress?: `0x${string}`;
  originTokenChainId?: number;
  className?: string;
};

export const RegisteredInterchainTokenCard: FC<Props> = (props) => {
  const { address } = useAccount();
  const chainId = useChainId();
  const { data: balance } = useInterchainTokenBalanceForOwnerQuery({
    chainId: props.chainId,
    tokenAddress: props.isRegistered ? props.tokenAddress : undefined,
    owner: address,
  });

  const { explorerUrl, explorerName } = useMemo(() => {
    if (!props.tokenAddress || !props.chain) {
      return {
        explorerName: "",
        explorerUrl: "",
      };
    }
    const { explorer } = props.chain;

    return {
      explorerName: explorer.name,
      explorerUrl: `${explorer.url}/token/${props.tokenAddress}`,
    };
  }, [props.chain, props.tokenAddress]);

  const { switchChainAsync } = useSwitchChain();

  const handleSwitchChain = useCallback(async () => {
    try {
      await switchChainAsync?.({ chainId: props.chainId });
    } catch (error) {
      if (error instanceof TransactionExecutionError) {
        toast.error(`Failed to switch chain: ${error.cause.shortMessage}`);
      }
    }
  }, [props.chainId, switchChainAsync]);

  const isSourceChain = chainId === props.chainId;

  const switchChainButton = (
    <Button
      size="xs"
      className="flex items-center gap-2"
      onClick={handleSwitchChain}
    >
      switch to{" "}
      <ChainIcon
        src={props.chain?.image ?? ""}
        size="xs"
        alt={props.chain?.name ?? ""}
      />
    </Button>
  );

  return (
    <Card
      compact
      className={cn(
        "bg-base-200 dark:bg-base-300 overflow-hidden transition-all ease-in",
        "hover:opacity-75 hover:shadow-xl",
        props.className
      )}
    >
      <Card.Body className="w-full">
        <Card.Title className="justify-between">
          {props.chain && (
            <Tooltip tip={`View on ${explorerName}`} position="bottom">
              <Link
                className="flex items-center gap-2"
                href={explorerUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ChainIcon
                  src={props.chain.image}
                  alt={props.chain.name}
                  size="md"
                />
                {props.chain.name}
              </Link>
            </Tooltip>
          )}
          {props.isOriginToken &&
          (balance?.isTokenMinter || balance?.isTokenOwner) ? (
            <ManageInterchainToken
              trigger={
                <Button
                  size="xs"
                  aria-label="manage interchain token"
                  className="group absolute right-4 top-4 px-2 py-1"
                  variant="primary"
                  outline
                >
                  <SettingsIcon className="-mr-4 h-[1em] -translate-x-2" />
                  Manage Token
                </Button>
              }
              tokenAddress={props.tokenAddress}
              balance={BigInt(balance.tokenBalance)}
              isTokenOwner={balance.isTokenOwner}
              isTokenPendingOnwer={balance.isTokenPendingOwner}
              isTokenMinter={balance.isTokenMinter}
              hasPendingOwner={balance.hasPendingOwner}
              tokenId={props.tokenId}
            />
          ) : (
            <StatusIndicator
              isOriginToken={props.isOriginToken}
              isRegistered={props.isRegistered}
            />
          )}
          {props.deploymentStatus && (
            <Badge
              outline
              variant="warning"
              className="flex items-center gap-0.5"
            >
              <span className="-translate-x-1">
                <SpinnerIcon className="text-info h-2.5 w-2.5 animate-spin" />
              </span>
              <span className="-translate-y-px">{props.deploymentStatus}</span>
            </Badge>
          )}
        </Card.Title>

        {!balance?.tokenBalance ? (
          !address ? null : (
            <div className="bg-base-300 dark:bg-base-100 flex items-center justify-between rounded-xl p-2 pl-4">
              <span className="mx-auto">Loading balance...</span>
            </div>
          )
        ) : (
          <div className="bg-base-300 dark:bg-base-100 flex items-center justify-between rounded-xl p-2 pl-4">
            {balance.tokenBalance === "0" ? (
              <div className="flex w-full items-center justify-between">
                <span
                  className={cn({
                    "mx-auto":
                      !isSourceChain ||
                      (!balance.isTokenOwner && !balance.isTokenPendingOwner),
                  })}
                >
                  No balance
                </span>
                {balance.isTokenOwner && !isSourceChain && switchChainButton}

                {balance.isTokenPendingOwner && (
                  <>
                    <AcceptInterchainTokenOwnership
                      accountAddress={address as `0x${string}`}
                      tokenAddress={props.tokenAddress}
                      sourceChain={props.chain as EVMChainConfig}
                      tokenId={props.tokenId}
                    />
                  </>
                )}
              </div>
            ) : (
              <>
                <div>
                  Balance:{" "}
                  <BigNumberText
                    decimals={Number(balance.decimals) ?? 0}
                    localeOptions={{
                      minimumFractionDigits: 0,
                      notation: "compact",
                    }}
                  >
                    {BigInt(balance.tokenBalance)}
                  </BigNumberText>
                </div>
                {isSourceChain ? (
                  <>
                    {balance.isTokenPendingOwner ? (
                      <AcceptInterchainTokenOwnership
                        accountAddress={address as `0x${string}`}
                        tokenAddress={props.tokenAddress}
                        sourceChain={props.chain as EVMChainConfig}
                        tokenId={props.tokenId}
                      />
                    ) : (
                      <SendInterchainToken
                        trigger={
                          <Button
                            size="xs"
                            variant="primary"
                            className="absolute right-6"
                            disabled={
                              !props.hasRemoteTokens ||
                              shouldDisableSend(
                                props.axelarChainId,
                                props.tokenAddress
                              )
                            }
                          >
                            Transfer
                          </Button>
                        }
                        tokenAddress={props.tokenAddress}
                        tokenId={props.tokenId}
                        kind={props.kind}
                        sourceChain={props.chain as EVMChainConfig}
                        balance={balance}
                        originTokenAddress={props.originTokenAddress}
                        originTokenChainId={props.originTokenChainId}
                      />
                    )}
                  </>
                ) : (
                  switchChainButton
                )}
              </>
            )}
          </div>
        )}
        {props.tokenManagerAddress && (
          <Card.Actions className="justify-between">
            <Tooltip
              tip="Contract responsible for managing tokens"
              variant="info"
              position="top"
              className="flex w-full items-center space-x-2"
            >
              <span>Token Manager Address</span>
              <InfoIcon className="text-info h-[1em] w-[1em]" />
            </Tooltip>

            <CopyToClipboardButton
              copyText={props.tokenManagerAddress}
              variant="ghost"
              length="block"
              size="sm"
              className="bg-base-300 dark:bg-base-100"
            >
              {maskAddress(props.tokenManagerAddress, {
                segmentA: 10,
                segmentB: -10,
              })}
            </CopyToClipboardButton>
          </Card.Actions>
        )}
        <Card.Actions className="justify-between">
          Token Address
          <CopyToClipboardButton
            copyText={props.tokenAddress}
            variant="ghost"
            length="block"
            size="sm"
            className="bg-base-300 dark:bg-base-100"
          >
            {maskAddress(props.tokenAddress, {
              segmentA: 10,
              segmentB: -10,
            })}
          </CopyToClipboardButton>
        </Card.Actions>
      </Card.Body>
    </Card>
  );
};

export default RegisteredInterchainTokenCard;
