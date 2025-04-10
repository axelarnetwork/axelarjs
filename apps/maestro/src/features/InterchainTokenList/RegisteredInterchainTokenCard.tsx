import type { EVMChainConfig } from "@axelarjs/api/axelarscan";
import {
  Badge,
  Button,
  Card,
  cn,
  CopyToClipboardButton,
  InfoIcon,
  LinkButton,
  SettingsIcon,
  SpinnerIcon,
  Tooltip,
} from "@axelarjs/ui";
import { toast } from "@axelarjs/ui/toaster";
import { maskAddress } from "@axelarjs/utils";
import { useCallback, useMemo, type FC } from "react";
import Image from "next/image";
import Link from "next/link";

import { TransactionExecutionError } from "viem";

import { dexLinks } from "~/config/dex";
import { NEXT_PUBLIC_NETWORK_ENV, shouldDisableSend } from "~/config/env";
import { useAccount, useChainId, useSwitchChain } from "~/lib/hooks";
import { useInterchainTokenBalanceForOwnerQuery } from "~/services/interchainToken/hooks";
import BigNumberText from "~/ui/components/BigNumberText";
import { ChainIcon } from "~/ui/components/ChainsDropdown";
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
    <Tooltip tip={tip} aria-label={tip} $position="left">
      <Badge $size="sm" $variant={props.isOriginToken ? "success" : "info"} />
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
  const normalizedTokenAddress = props.tokenAddress?.includes(":")
    ? props.tokenAddress.split(":")[0] // use only the first part of the address for sui
    : props.tokenAddress;
  // A user can have a token on a different chain, but the if address is the same as for all EVM chains, they can check their balance
  // To check sui for example, they need to connect with a sui wallet
  const isIncompatibleChain =
    normalizedTokenAddress?.length !== address?.length;
  const result = useInterchainTokenBalanceForOwnerQuery({
    chainId: props.chainId,
    tokenAddress: props.isRegistered ? props.tokenAddress : undefined,
    owner: address,
    disabled: !props.isRegistered || isIncompatibleChain,
  });
  const balance = result?.data;

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
      explorerUrl: props.chain.id.includes("stellar")
        ? `${explorer.url}/contract/${props.tokenAddress}`
        : `${explorer.url}/token/${props.tokenAddress}`,
    };
  }, [props.chain, props.tokenAddress]);

  const { switchChain } = useSwitchChain();

  const handleSwitchChain = useCallback(() => {
    try {
      switchChain?.({ chainId: props.chainId });
    } catch (error) {
      if (error instanceof TransactionExecutionError) {
        toast.error(`Failed to switch chain: ${error.cause.shortMessage}`);
      }
    }
  }, [props.chainId, switchChain]);

  const isSourceChain = chainId === props.chainId;

  const switchChainButton = (
    <Button
      $size="xs"
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

  const isMainnet = NEXT_PUBLIC_NETWORK_ENV === "mainnet";
  const dex = dexLinks[props.chain?.id as string]?.(props.tokenAddress);

  return (
    <Card
      $compact
      className={cn(
        "overflow-hidden bg-base-200 transition-all ease-in dark:bg-base-300",
        props.className
      )}
    >
      <Card.Body className="w-full">
        <Card.Title className="justify-between">
          {props.chain && (
            <Tooltip tip={`View on ${explorerName}`} $position="bottom">
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
                  $size="xs"
                  $variant="primary"
                  $outline
                  aria-label="manage interchain token"
                  className="group absolute right-4 top-4 px-2 py-1"
                >
                  <SettingsIcon className="-mr-4 h-[1em] -translate-x-2" />
                  Manage Token
                </Button>
              }
              tokenAddress={props.tokenAddress}
              balance={BigInt(balance.tokenBalance)}
              isTokenOwner={balance.isTokenOwner}
              isTokenPendingOnwer={balance.isTokenPendingOwner}
              isTokenMinter={balance.isTokenMinter as boolean}
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
              $outline
              $variant="warning"
              className="flex items-center gap-0.5"
            >
              <span className="-translate-x-1">
                <SpinnerIcon className="h-2.5 w-2.5 animate-spin text-info" />
              </span>
              <span className="-translate-y-px">{props.deploymentStatus}</span>
            </Badge>
          )}
        </Card.Title>

        {!balance?.tokenBalance ? (
          !address ? null : (
            <div>
              {props.chain?.id?.toLowerCase().includes("stellar") ? (
                <LinkButton
                  $size="xs"
                  $variant="primary"
                  className="my-1 flex w-full items-center justify-center gap-2"
                  href={explorerUrl}
                  target="_blank"
                >
                  View on Stellar Explorer{" "}
                  <ChainIcon
                    src={props.chain?.image ?? ""}
                    size="xs"
                    alt={props.chain?.name ?? ""}
                  />
                </LinkButton>
              ) : isIncompatibleChain ? (
                <Button
                  $size="xs"
                  $variant="primary"
                  className="my-1 flex w-full"
                  onClick={handleSwitchChain}
                >
                  Connect to {props.chain?.name ?? "chain"} to see your balance{" "}
                  <ChainIcon
                    src={props.chain?.image ?? ""}
                    size="xs"
                    alt={props.chain?.name ?? ""}
                  />
                </Button>
              ) : (
                <div className="flex items-center justify-between rounded-xl bg-base-300 p-2 pl-4 dark:bg-base-100">
                  <span className="mx-auto">Loading balance...</span>
                </div>
              )}
            </div>
          )
        ) : (
          <div className="flex items-center justify-between rounded-xl bg-base-300 p-2 pl-4 dark:bg-base-100">
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
                      accountAddress={address}
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
                        accountAddress={address}
                        tokenAddress={props.tokenAddress}
                        sourceChain={props.chain as EVMChainConfig}
                        tokenId={props.tokenId}
                      />
                    ) : (
                      <SendInterchainToken
                        trigger={
                          <Button
                            $size="xs"
                            $variant="primary"
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
              className="flex w-full items-center space-x-2"
              $variant="info"
              $position="top"
            >
              <span>Token Manager Address</span>
              <InfoIcon className="h-[1em] w-[1em] text-info" />
            </Tooltip>

            <CopyToClipboardButton
              $variant="ghost"
              $length="block"
              $size="sm"
              copyText={props.tokenManagerAddress}
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
            $variant="ghost"
            $length="block"
            $size="sm"
            copyText={props.tokenAddress}
            className="bg-base-300 dark:bg-base-100"
          >
            {maskAddress(props.tokenAddress, {
              segmentA: 10,
              segmentB: -10,
            })}
          </CopyToClipboardButton>
        </Card.Actions>
        {isMainnet && dex && (
          <Card.Actions className="mt-2 flex flex-col justify-between">
            Add Liquidity
            <LinkButton
              className="min-w-24 self-stretch bg-base-300 py-1 ease-in hover:opacity-75 dark:bg-base-100"
              $size={"md"}
              href={dex.url}
              target="_blank"
            >
              <div className="flex items-center gap-2">
                <Image src={dex.icon} width="20" height="20" alt="uniswap" />
                <span>{dex.name}</span>
              </div>
            </LinkButton>
          </Card.Actions>
        )}
      </Card.Body>
    </Card>
  );
};

export default RegisteredInterchainTokenCard;
