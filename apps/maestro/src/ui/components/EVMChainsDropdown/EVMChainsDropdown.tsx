import type { EVMChainConfig } from "@axelarjs/api/axelarscan";
import { Dropdown, HelpCircleIcon } from "@axelarjs/ui";
import { toast } from "@axelarjs/ui/toaster";
import { cn } from "@axelarjs/ui/utils";
import { Maybe } from "@axelarjs/utils";
import { useMemo, type FC } from "react";
import Image from "next/image";

import { find, propEq } from "rambda";
import { TransactionExecutionError } from "viem";

import { useAccount, useSwitchChain } from "~/lib/hooks";
import { logger } from "~/lib/logger";
import { useEVMChainConfigsQuery } from "~/services/axelarscan/hooks";
import {
  useEVMChainsDropdownContainer,
  withEVMChainsDropdownProvider,
} from "./EVMChainsDropdown.state";

const ICON_SIZES = {
  xs: 14,
  sm: 18,
  md: 24,
  lg: 32,
};

export const ChainIcon: FC<{
  size: keyof typeof ICON_SIZES;
  src: string;
  alt: string;
  className?: string;
}> = (props) => {
  const iconSize = ICON_SIZES[props.size];

  return (
    <div
      className={cn(
        "rounded-full bg-base-200 p-0.5 shadow-black group-hover:ring-2",
        props.className
      )}
    >
      <Image
        className="overflow-hidden rounded-full bg-base-300"
        src={props.src}
        alt={props.alt}
        width={iconSize}
        height={iconSize}
      />
    </div>
  );
};

type Props = {
  chains?: EVMChainConfig[];
  compact?: boolean;
  hideLabel?: boolean;
  disabled?: boolean;
  triggerClassName?: string;
  chainIconClassName?: string;
  contentClassName?: string;
  renderTrigger?: () => React.ReactNode;
  selectedChain?: EVMChainConfig;
  onSelectChain?: (chain: EVMChainConfig | null) => void;
  size?: keyof typeof ICON_SIZES;
};

export const EVMChainIcon: FC<Props> = (props) => {
  const { data: evmChains } = useEVMChainConfigsQuery();
  const { chain } = useAccount();

  const [state] = useEVMChainsDropdownContainer();

  const selectedChain = useMemo(
    () =>
      Maybe.of(evmChains).mapOrUndefined(
        find((x) => [chain?.id, state.selectedChainId].includes(x.chain_id))
      ),
    [chain?.id, evmChains, state.selectedChainId]
  );

  if (props.selectedChain && props.onSelectChain) {
    return (
      <>
        <ChainIcon
          src={props.selectedChain.image}
          alt={props.selectedChain.name}
          size={props.size ?? "sm"}
          className={cn(
            { "-translate-x-1.5": !props.hideLabel },
            props.chainIconClassName
          )}
        />
        {!props.hideLabel && <span>{props.selectedChain.name}</span>}
      </>
    );
  } else if (selectedChain) {
    return (
      <>
        <ChainIcon
          src={selectedChain.image}
          alt={selectedChain.chain_name}
          size={props.size ?? "sm"}
          className={cn(
            { "-translate-x-1.5": !props.hideLabel },
            props.chainIconClassName
          )}
        />
        {!props.hideLabel && <span>{selectedChain.name}</span>}
      </>
    );
  } else {
    return (
      <HelpCircleIcon
        size="24"
        className={cn(
          { "-translate-x-1.5": !props.hideLabel },
          props.chainIconClassName
        )}
      />
    );
  }
};

const EVMChainsDropdown: FC<Props> = (props) => {
  const { data: evmChains } = useEVMChainConfigsQuery();
  const { chain } = useAccount();
  const { switchChain } = useSwitchChain();

  const [state, actions] = useEVMChainsDropdownContainer();

  const selectedChain = useMemo(
    () =>
      Maybe.of(evmChains).mapOrUndefined(
        find((x) => [chain?.id, state.selectedChainId].includes(x.chain_id))
      ),
    [chain?.id, evmChains, state.selectedChainId]
  );

  const eligibleChains = Maybe.of(props.chains ?? evmChains).mapOr(
    [],
    (chains) =>
      chains.filter((chain) => chain.chain_id !== selectedChain?.chain_id)
  );

  const handleChainChange = (chainId: number) => {
    try {
      if (props.onSelectChain) {
        props.onSelectChain(
          eligibleChains.find(propEq(chainId, "chain_id")) ?? null
        );
      } else {
        switchChain?.({ chainId });
        if (!chain) {
          // only update state if not connected to a chain
          actions.selectChainId(chainId);
        }
      }
    } catch (error) {
      if (error instanceof TransactionExecutionError) {
        toast.error(`Failed to switch network: ${error.cause.shortMessage}`);
        return;
      }

      if (process.env.NODE_ENV === "development") {
        if (error instanceof Error) {
          console.error("failed to switch network:", error.message);
        }
      }
    }
  };

  return (
    <Dropdown $align="end">
      {props.renderTrigger?.() ?? (
        <Dropdown.Trigger
          $as="button"
          role="button"
          aria-label="Select Chain"
          className={cn(
            "group btn btn-ghost btn-sm flex w-full items-center gap-2 rounded-full",
            {
              "pointer-events-none": props.disabled,
            },
            props.triggerClassName
          )}
          tabIndex={props.compact ? -1 : 0}
        >
          {/* if both selectedChain and onSelectedChain exist,
              operate in controlled mode
          */}
          <EVMChainIcon {...props} />
        </Dropdown.Trigger>
      )}

      {eligibleChains.length > 0 && !props.disabled && (
        <Dropdown.Content
          className={cn(
            "z-10 mt-2 max-h-[75vh] w-full dark:bg-base-200 md:w-96",
            {
              "broder max-h-[350px] w-80 overflow-x-scroll bg-base-200 dark:bg-base-300 md:w-96":
                props.compact,
            },
            props.contentClassName
          )}
        >
          {!chain && (
            <Dropdown.Item className="text-base-content">
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();

                  props.onSelectChain?.(null);
                  actions.selectChainId(null);
                }}
                className="group"
                role="button"
              >
                <div className="rounded-full bg-base-200 p-0.5 shadow-black group-hover:ring-2">
                  <HelpCircleIcon size="24" />
                </div>
                <div>All Chains</div>
              </a>
            </Dropdown.Item>
          )}
          {eligibleChains.map((chain) => (
            <Dropdown.Item
              key={chain.chain_id}
              className={cn({
                "pointer-events-none":
                  chain.chain_id === selectedChain?.chain_id,
              })}
            >
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleChainChange(chain.chain_id).catch((error) => {
                    logger.error(error);
                  });
                }}
                className="group"
              >
                <ChainIcon src={chain.image} alt={chain.name} size="md" />
                <div>{chain.name}</div>
              </a>
            </Dropdown.Item>
          ))}
        </Dropdown.Content>
      )}
    </Dropdown>
  );
};
export default withEVMChainsDropdownProvider(EVMChainsDropdown);
