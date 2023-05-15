import { FC, useState } from "react";

import { EVMChainConfig } from "@axelarjs/api";
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
import { useGetERC20TokenBalanceForOwnerQuery } from "~/services/gmp/hooks";

import { SendInterchainToken } from "../SendInterchainToken";
import { TokenInfo } from "./types";

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

export type InterchainTokenCardProps = TokenInfo & {
  onToggleSelection?: () => void;
};

export const InterchainTokenCard: FC<InterchainTokenCardProps> = (props) => {
  const { address } = useAccount();
  const { chain } = useNetwork();
  const { data: balance } = useGetERC20TokenBalanceForOwnerQuery({
    chainId: props.chainId,
    tokenAddress: props.isRegistered ? props.tokenAddress : undefined,
    owner: address,
  });
  const router = useRouter();

  const { switchNetworkAsync } = useSwitchNetwork();

  const isSourceChain = chain?.id === props.chainId;

  const handleSwitchChain = async () => {
    try {
      await switchNetworkAsync?.(props.chainId);

      router.push(
        `/${sluggify(props.wagmiConfig?.name ?? "")}/${props.tokenAddress}`
      );
    } catch (error) {}
  };

  const [isSendModalOpen, setIsSendModalOpen] = useState(false);

  return (
    <Card
      compact={true}
      key={props.chainId}
      bordered={!props.isRegistered}
      onClick={!props.deploymentStatus ? props.onToggleSelection : undefined}
      className={clsx(
        "bg-base-200 dark:bg-base-300 relative overflow-hidden transition-all ease-in",
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
      {props.onToggleSelection && (
        <div
          style={{
            backgroundImage: `url(${props.chain?.image})`,
          }}
          className={clsx(
            "absolute inset-0 scale-100 bg-cover opacity-0 blur-3xl transition-all duration-300",
            "bg-center delay-150 hover:scale-150 hover:opacity-20",
            {
              "scale-125 opacity-25 hover:scale-150 hover:blur-sm":
                props.isSelected,
            }
          )}
        />
      )}
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
                    {BigInt(balance.tokenBalance)}
                  </BigNumberText>
                </div>
                {isSourceChain ? (
                  <SendInterchainToken
                    isOpen={isSendModalOpen}
                    onClose={() => setIsSendModalOpen(false)}
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
                    tokenId={props.tokenId}
                    sourceChain={props.chain as EVMChainConfig}
                    balance={balance}
                  />
                ) : (
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
