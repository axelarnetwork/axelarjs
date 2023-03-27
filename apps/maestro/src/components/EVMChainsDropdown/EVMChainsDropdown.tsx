import React, { FC } from "react";

import { Dropdown } from "@axelarjs/ui";
import clsx from "clsx";
import Image from "next/image";

import { EVMChainConfig } from "~/services/axelarscan/types";

type Props = {
  onSwitchNetwork?: (chainId: number) => void;
  selectedChain?: EVMChainConfig;
  chains?: EVMChainConfig[];
  compact?: boolean;
};

const iconSizes = {
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

const EVMChainsDropdown: FC<Props> = (props) => {
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

  if (!props.selectedChain) {
    return null;
  }

  return (
    <Dropdown align="end">
      <Dropdown.Trigger className="btn btn-sm btn-ghost group flex items-center gap-2">
        <ChainIcon
          src={props.selectedChain.image}
          alt={props.selectedChain.chain_name}
          size="sm"
        />
        <span>{props.selectedChain.chain_name}</span>
      </Dropdown.Trigger>
      <Dropdown.Content
        className={clsx("dark:bg-base-200 w-48", {
          "bg-base-200 dark:bg-base-300 max-h-80 w-96 translate-x-8 translate-y-2 overflow-x-scroll":
            props.compact,
        })}
      >
        {props.chains?.map((chain) => (
          <Dropdown.Item
            key={chain.chain_id}
            className={clsx({
              "pointer-events-none":
                chain.chain_id === props.selectedChain?.chain_id,
            })}
          >
            {/* rome-ignore lint/a11y/useValidAnchor: <explanation> */}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleChainChange(chain.chain_id);
              }}
              className="group"
            >
              <ChainIcon src={chain.image} alt={chain.chain_name} size="md" />
              <div>{chain.chain_name}</div>
            </a>
          </Dropdown.Item>
        ))}
      </Dropdown.Content>
    </Dropdown>
  );
};

export default EVMChainsDropdown;
