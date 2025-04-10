import { ITSChainConfig } from "@axelarjs/api";
import { Dropdown, HelpCircleIcon } from "@axelarjs/ui";
import { toast } from "@axelarjs/ui/toaster";
import { cn } from "@axelarjs/ui/utils";
import { Maybe } from "@axelarjs/utils";
import { useMemo, useState, type FC } from "react";
import Image from "next/image";

import { find, propEq } from "rambda";
import { TransactionExecutionError } from "viem";

import { useAccount, useSwitchChain } from "~/lib/hooks";
import { useAllChainConfigsQuery } from "~/services/axelarscan/hooks";
import {
  useChainsDropdownContainer,
  withChainsDropdownProvider,
} from "./ChainsDropdown.state";

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
  const [isLoaded, setIsLoaded] = useState(false);
  const iconSize = ICON_SIZES[props.size];

  return (
    <div
      className={cn(
        "rounded-full bg-base-200 p-0.5 shadow-black group-hover:ring-2",
        isLoaded ? "opacity-100" : "opacity-0",
        "transition-opacity duration-200",
        props.className
      )}
    >
      <div
        className={cn("overflow-hidden rounded-full bg-base-300")}
        style={{ width: iconSize, height: iconSize }}
      >
        <Image
          className={cn("overflow-hidden rounded-full bg-base-300")}
          src={props.src}
          alt={props.alt}
          width={iconSize}
          height={iconSize}
          onLoad={() => setIsLoaded(true)}
          onError={() => setIsLoaded(false)}
        />
      </div>
    </div>
  );
};

type Props = {
  chains?: ITSChainConfig[];
  compact?: boolean;
  hideLabel?: boolean;
  disabled?: boolean;
  triggerClassName?: string;
  chainIconClassName?: string;
  contentClassName?: string;
  renderTrigger?: () => React.ReactNode;
  selectedChain?: ITSChainConfig;
  onSelectChain?: (chain?: ITSChainConfig) => void;
  size?: keyof typeof ICON_SIZES;
  chainType?: "evm" | "vm";
  excludeChainIds?: number[];
};

export const ChainIconComponent: FC<Props> = (props) => {
  const { allChains: chains } = useAllChainConfigsQuery();
  const { chain } = useAccount();

  const [state] = useChainsDropdownContainer();

  const selectedChain = useMemo(
    () =>
      Maybe.of(chains).mapOrUndefined(
        find((x) => [chain?.id, state.selectedChainId].includes(x.chain_id))
      ),
    [chain?.id, chains, state.selectedChainId]
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

const ChainsDropdown: FC<Props> = (props) => {
  const { allChains } = useAllChainConfigsQuery();
  const { chain } = useAccount();
  const { switchChain } = useSwitchChain();

  const [state, actions] = useChainsDropdownContainer();

  const selectedChain = useMemo(
    () =>
      Maybe.of(allChains).mapOrUndefined(
        find((x) => [chain?.id, state.selectedChainId].includes(x.chain_id))
      ),
    [chain?.id, allChains, state.selectedChainId]
  );

  const eligibleChains = Maybe.of(props.chains ?? allChains).mapOr(
    [],
    (chains) =>
      chains.filter(
        (chain) =>
          !props.excludeChainIds?.includes(chain.chain_id) &&
          chain.chain_id !== selectedChain?.chain_id
      )
  );

  const handleChainChange = (chainId: number) => {
    try {
      if (props.onSelectChain) {
        props.onSelectChain(
          eligibleChains.find(propEq(chainId, "chain_id")) ?? null
        );
      } else {
        const selectedChain = eligibleChains.find(
          (chain) => chain.chain_id === chainId
        );

        if (!selectedChain) {
          toast.error("Chain not found");
          return;
        }
        switchChain?.({ chainId });

        if (!chain) {
          actions.selectChainId(chainId, "evm");
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
          <ChainIconComponent {...props} />
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
              <button
                onClick={(e: React.MouseEvent) => {
                  e.preventDefault();
                  props.onSelectChain?.(undefined);
                  actions.selectChainId(null);
                }}
                className="group flex w-full items-center gap-2"
                role="button"
              >
                <div className="rounded-full bg-base-200 p-0.5 shadow-black group-hover:ring-2">
                  <HelpCircleIcon size="24" />
                </div>
                <div>All Chains</div>
              </button>
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
              <button
                onClick={(e: React.MouseEvent) => {
                  e.preventDefault();
                  handleChainChange(chain.chain_id);
                }}
                className="group flex w-full items-center gap-2"
              >
                <ChainIcon src={chain.image} alt={chain.name} size="md" />
                <div>{chain.name}</div>
              </button>
            </Dropdown.Item>
          ))}
        </Dropdown.Content>
      )}
    </Dropdown>
  );
};

export default withChainsDropdownProvider(ChainsDropdown);
