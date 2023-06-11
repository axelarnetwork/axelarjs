import type { EVMChainConfig } from "@axelarjs/api/axelarscan";
import { Dropdown } from "@axelarjs/ui";
import { Maybe } from "@axelarjs/utils";
import { useState, type FC } from "react";
import Image from "next/image";

import clsx from "clsx";
import { find } from "rambda";
import { useNetwork } from "wagmi";

import { useEVMChainConfigsQuery } from "~/services/axelarscan/hooks";

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
        "bg-basep-200 relative rounded-full p-0.5 shadow-black group-hover:ring-2",
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
  onSwitchNetwork?: (chainId: number) => void;
  selectedChain?: EVMChainConfig;
  chains?: EVMChainConfig[];
  compact?: boolean;
  disabled?: boolean;
  triggerClassName?: string;
  chainIconClassName?: string;
  renderTrigger?: () => React.ReactNode;
};

const EVMChainsDropdown: FC<Props> = (props) => {
  const { data: evmChains } = useEVMChainConfigsQuery();
  const { chain } = useNetwork();

  const defaultSelectedChain = Maybe.of(evmChains).mapOrUndefined(
    find((x) => x.chain_id === chain?.id)
  );

  const handleChainChange = (chainId: number) => {
    try {
      props.onSwitchNetwork?.(chainId);
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        if (error instanceof Error) {
          console.error("failed to switch network:", error.message);
        }
      }
    }
  };

  const [isOpen, setIsOpen] = useState(false);

  const selectedChain = props.selectedChain ?? defaultSelectedChain;

  const eligibleChains = Maybe.of(props.chains ?? evmChains).mapOr(
    [],
    (chains) =>
      chains.filter((chain) => chain.chain_id !== selectedChain?.chain_id)
  );

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
          {selectedChain ? (
            <>
              <ChainIcon
                src={selectedChain.image}
                alt={selectedChain.chain_name}
                size="sm"
                className={props.chainIconClassName}
              />
              <span>{selectedChain.name}</span>
            </>
          ) : (
            <ChainIcon
              src="/logos/chains/ethereum.svg"
              alt="Ethereum"
              size="sm"
              className={props.chainIconClassName}
            />
          )}
        </Dropdown.Trigger>
      )}

      {eligibleChains.length > 0 && (
        <Dropdown.Content
          className={clsx(
            "dark:bg-base-200 z-10 mt-2 max-h-[80vh] w-full md:w-48",
            {
              "bg-base-200 dark:bg-base-300 broder max-h-[300px] w-80 translate-x-4 overflow-x-scroll md:w-96":
                props.compact,
            }
          )}
        >
          {eligibleChains.map((chain) => (
            <Dropdown.Item
              key={chain.chain_id}
              className={clsx({
                "pointer-events-none":
                  chain.chain_id === props.selectedChain?.chain_id,
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

export default EVMChainsDropdown;
