import { Button, Dropdown } from "@axelarjs/ui";
import Image from "next/image";
import React, { FC } from "react";
import { EVMChainConfig } from "~/lib/api/axelarscan/types";

type Props = {
  onSwitchNetwork?: (chainId: number) => void;
  selectedChain?: EVMChainConfig;
  chains?: EVMChainConfig[];
};

export const EVMChainsDropdown: FC<Props> = (props) => {
  if (!props.selectedChain) {
    return null;
  }

  return (
    <Dropdown align="end">
      <Dropdown.Trigger className="flex items-center gap-2" ghost size="sm">
        <Image
          className="rounded-full"
          src={props.selectedChain.image}
          alt={props.selectedChain.chain_name}
          width={18}
          height={18}
        />
        <span>{props.selectedChain.chain_name}</span>
      </Dropdown.Trigger>
      <Dropdown.Content className="dark:bg-base-200">
        {props.chains?.map((chain) => (
          <Dropdown.Item key={chain.chain_id}>
            <Button
              $as="a"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                try {
                  props.onSwitchNetwork?.(chain.chain_id);
                } catch (error) {
                  if (process.env.NODE_ENV === "development") {
                    if (error instanceof Error) {
                      console.error("failed to switch network:", error.message);
                    }
                  }
                }
              }}
            >
              <div className="flex items-center gap-2">
                <Image
                  className="rounded-full bg-base-300 overflow-hidden"
                  src={chain.image}
                  alt={chain.chain_name}
                  width={24}
                  height={24}
                />
                <div>{chain.chain_name}</div>
              </div>
            </Button>
          </Dropdown.Item>
        ))}
      </Dropdown.Content>
    </Dropdown>
  );
};
