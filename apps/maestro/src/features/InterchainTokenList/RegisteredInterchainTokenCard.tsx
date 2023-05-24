import { useCallback, useState, type FC } from "react";

import type { EVMChainConfig } from "@axelarjs/api/axelarscan";
import {
  Badge,
  Button,
  Card,
  CopyToClipboardButton,
  SpinnerIcon,
  Tooltip,
} from "@axelarjs/ui";
import { maskAddress, sluggify } from "@axelarjs/utils";
import clsx from "clsx";
import { useRouter } from "next/router";
import { useAccount, useNetwork, useSwitchNetwork } from "wagmi";

import BigNumberText from "~/components/BigNumberText";
import { ChainIcon } from "~/components/EVMChainsDropdown";
import { useInterchainTokenBalanceForOwnerQuery } from "~/services/interchainToken/hooks";

import { MintInterchainToken } from "../MintInterchainToken";
import { SendInterchainToken } from "../SendInterchainToken";
import type { TokenInfo } from "./types";

const StatusIndicator = (
  props: Pick<TokenInfo, "isOriginToken" | "isRegistered">
) => {
  if (!props.isRegistered && !props.isOriginToken) {
    return null;
  }

  const tip = props.isOriginToken ? "orign token" : "registered";

  return (
    <Tooltip tip={tip} aria-label={tip} position="left">
      <Badge size="sm" color={props.isOriginToken ? "success" : "info"} />
    </Tooltip>
  );
};

export type Props = TokenInfo;

export const RegisteredInterchainTokenCard: FC<Props> = (props) => {
  const { address } = useAccount();
  const { chain } = useNetwork();
  const { data: balance } = useInterchainTokenBalanceForOwnerQuery({
    chainId: props.chainId,
    tokenAddress: props.isRegistered ? props.tokenAddress : undefined,
    owner: address,
  });

  const router = useRouter();

  const { switchNetworkAsync } = useSwitchNetwork();

  const handleSwitchChain = useCallback(async () => {
    try {
      await switchNetworkAsync?.(props.chainId);

      router.push(
        `/${sluggify(props.wagmiConfig?.name ?? "")}/${props.tokenAddress}`
      );
    } catch (error) {}
  }, [
    props.chainId,
    props.tokenAddress,
    props.wagmiConfig?.name,
    router,
    switchNetworkAsync,
  ]);

  const [activeModal, setActiveModal] = useState<"send" | "mint" | null>(null);

  const isSourceChain = chain?.id === props.chainId;

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
      className={clsx(
        "bg-base-200 dark:bg-base-300 relative overflow-hidden transition-all ease-in",
        "hover:opacity-75 hover:shadow-xl"
      )}
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
          <StatusIndicator
            isOriginToken={props.isOriginToken}
            isRegistered={props.isRegistered}
          />
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

        {balance?.tokenBalance && (
          <div
            className={clsx(
              "bg-base-300 dark:bg-base-100 flex items-center justify-between rounded-xl p-2 pl-4"
            )}
          >
            {balance.tokenBalance === "0" ? (
              <div className="flex w-full items-center justify-between">
                <span className={clsx({ "mx-auto": !isSourceChain })}>
                  No balance
                </span>
                {balance.isTokenOwner &&
                  (isSourceChain ? (
                    <MintInterchainToken
                      isOpen={activeModal === "mint"}
                      onClose={setActiveModal.bind(null, null)}
                      accountAddress={address as `0x${string}`}
                      trigger={
                        <Button
                          size="xs"
                          color="primary"
                          // TODO absolute positioning is used to prevent the button from shifting the card. This is a temporary fix.
                          className="absolute right-6"
                        >
                          mint
                        </Button>
                      }
                      tokenAddress={props.tokenAddress}
                      tokenDecimals={props.decimals}
                      tokenId={props.tokenId}
                      sourceChain={props.chain as EVMChainConfig}
                    />
                  ) : (
                    switchChainButton
                  ))}
              </div>
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
                    {BigInt(balance.tokenBalance)}
                  </BigNumberText>
                </div>
                {isSourceChain ? (
                  <SendInterchainToken
                    isOpen={activeModal === "send"}
                    onClose={setActiveModal.bind(null, null)}
                    trigger={
                      <Button
                        size="xs"
                        color="primary"
                        // TODO absolute positioning is used to prevent the button from shifting the card. This is a temporary fix.
                        className="absolute right-6"
                      >
                        send
                      </Button>
                    }
                    tokenAddress={props.tokenAddress}
                    sourceChain={props.chain as EVMChainConfig}
                    balance={balance}
                  />
                ) : (
                  switchChainButton
                )}
              </>
            )}
          </div>
        )}
        <Card.Actions className="justify-between">
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
        </Card.Actions>
      </Card.Body>
    </Card>
  );
};

export default RegisteredInterchainTokenCard;
