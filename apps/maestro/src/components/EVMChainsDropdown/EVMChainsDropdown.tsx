import { Dropdown, LinkButton } from "@axelarjs/ui";
import clsx from "clsx";
import Image from "next/image";
import React, { FC } from "react";
import { EVMChainConfig } from "~/lib/api/axelarscan/types";

type Props = {
  onSwitchNetwork?: (chainId: number) => void;
  selectedChain?: EVMChainConfig;
  chains?: EVMChainConfig[];
};

const iconSizes = {
  sm: 18,
  md: 24,
  lg: 32,
};

const ChainIcon: FC<{
  size: keyof typeof iconSizes;
  src: string;
  alt: string;
}> = (props) => {
  const iconSize = iconSizes[props.size];

  return (
    <div className="rounded-full shadow-black group-hover:ring-2 relative p-0.5">
      <Image
        className="rounded-full bg-base-300 overflow-hidden"
        src={props.src}
        alt={props.alt}
        width={iconSize}
        height={iconSize}
      />
    </div>
  );
};

export const EVMChainsDropdown: FC<Props> = (props) => {
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
      <Dropdown.Trigger
        className="flex items-center gap-2 group"
        ghost
        size="sm"
      >
        <ChainIcon
          src={props.selectedChain.image}
          alt={props.selectedChain.chain_name}
          size="sm"
        />
        <span>{props.selectedChain.chain_name}</span>
      </Dropdown.Trigger>
      <Dropdown.Content className="dark:bg-base-200 w-48">
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
