import type { EVMChainConfig } from "@axelarjs/api/axelarscan";
import { Dropdown, toast } from "@axelarjs/ui";
import { Maybe } from "@axelarjs/utils";
import { useMemo, useState, type FC } from "react";
import Image from "next/image";

import clsx from "clsx";
import { HelpCircleIcon } from "lucide-react";
import { find } from "rambda";
import { TransactionExecutionError } from "viem";
import { useNetwork, useSwitchNetwork } from "wagmi";

import { useEVMChainConfigsQuery } from "~/services/axelarscan/hooks";
import {
  useEVMChainsDropdownContainer,
  withEVMChainsDropdownProvider,
} from "./EVMChainsDropdown.state";

const iconSizes = {
  xs: 14,
  sm: 18,
  md: 24,
  lg: 32,
};

export const ChainIcon: FC<{
  size: keyof typeof iconSizes;
  src: string;
  alt: string;
  className?: string;
}> = (props) => {
  const iconSize = iconSizes[props.size];

  return (
    <div
      className={clsx(
        "bg-base-200 rounded-full p-0.5 shadow-black group-hover:ring-2",
        props.className
      )}
    >
      <Image
        className="bg-base-300 overflow-hidden rounded-full"
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
  disabled?: boolean;
  triggerClassName?: string;
  chainIconClassName?: string;
  contentClassName?: string;
  renderTrigger?: () => React.ReactNode;
  selectedChain?: EVMChainConfig;
  onSelectChain?: (chain: EVMChainConfig | null) => void;
};

const EVMChainsDropdown: FC<Props> = (props) => {
  const { data: evmChains } = useEVMChainConfigsQuery();
  const { chain } = useNetwork();
  const { switchNetworkAsync } = useSwitchNetwork();

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

  const handleChainChange = async (chainId: number) => {
    try {
      if (props.onSelectChain) {
        props.onSelectChain(
          eligibleChains.find((x) => x.chain_id === chainId)!
        );
      } else {
        await switchNetworkAsync?.(chainId);
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

  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dropdown align="end">
      {props.renderTrigger?.() ?? (
        <Dropdown.Trigger
          $as="button"
          className={clsx(
            "btn btn-sm btn-ghost group flex items-center gap-2",
            {
              "pointer-events-none": props.disabled,
            },
            props.triggerClassName
          )}
          tabIndex={props.compact ? -1 : 0}
          onClick={() => {
            setIsOpen(!isOpen);
          }}
        >
          {/* if both selectedChain and onSelectedChain exist, 
              operate in controlled mode 
          */}
          {props.selectedChain && props.onSelectChain ? (
            <>
              <ChainIcon
                src={props.selectedChain.image}
                alt={props.selectedChain.chain_name}
                size="sm"
                className={props.chainIconClassName}
              />
              {!props.compact && <span>{props.selectedChain.name}</span>}
            </>
          ) : selectedChain ? (
            <>
              <ChainIcon
                src={selectedChain.image}
                alt={selectedChain.chain_name}
                size="sm"
                className={props.chainIconClassName}
              />
              {!props.compact && <span>{selectedChain.name}</span>}
            </>
          ) : (
            <HelpCircleIcon size="24" className={props.chainIconClassName} />
          )}
        </Dropdown.Trigger>
      )}

      {eligibleChains.length > 0 && !props.disabled && (
        <Dropdown.Content
          className={clsx(
            "dark:bg-base-200 z-10 mt-2 max-h-[80vh] w-full md:w-48",
            {
              "bg-base-200 dark:bg-base-300 broder max-h-[300px] w-80 overflow-x-scroll md:w-96":
                props.compact,
            },
            props.contentClassName
          )}
        >
          {!chain && (
            <Dropdown.Item className="text-base-content">
              {/* rome-ignore lint/a11y/useValidAnchor: needed by daisyui */}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();

                  props.onSelectChain?.(null);
                  actions.selectChainId(null);
                }}
                className="group"
              >
                <div className="bg-base-200 rounded-full p-0.5 shadow-black group-hover:ring-2">
                  <HelpCircleIcon size="24" />
                </div>
                <div>All Chains</div>
              </a>
            </Dropdown.Item>
          )}
          {eligibleChains.map((chain) => (
            <Dropdown.Item
              key={chain.chain_id}
              className={clsx({
                "pointer-events-none":
                  chain.chain_id === selectedChain?.chain_id,
              })}
            >
              {/* rome-ignore lint/a11y/useValidAnchor: needed by daisyui */}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleChainChange(chain.chain_id);
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
