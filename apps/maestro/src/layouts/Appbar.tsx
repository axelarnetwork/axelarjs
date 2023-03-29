import React, { FC, useMemo } from "react";

import {
  AxelarIcon,
  Badge,
  Button,
  CopyToClipboardButton,
  LinkButton,
  Navbar,
  ThemeSwitcher,
  useIsSticky,
} from "@axelarjs/ui";
import { maskAddress } from "@axelarjs/utils";
import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/router";
import { useAccount, useDisconnect, useNetwork, useSwitchNetwork } from "wagmi";

import EVMChainsDropdown from "~/components/EVMChainsDropdown";
import ConnectWalletButton from "~/compounds/ConnectWalletButton/ConnectWalletButton";
import { APP_NAME } from "~/config/app";
import { useEVMChainConfigsQuery } from "~/services/axelarscan/hooks";

export type AppbarProps = {};

const Appbar: FC<AppbarProps> = (props) => {
  const { disconnect } = useDisconnect();
  const { chain } = useNetwork();
  const { isConnected, address } = useAccount();
  const { switchNetworkAsync } = useSwitchNetwork();
  const router = useRouter();

  const { data: evmChains } = useEVMChainConfigsQuery();

  const selectedChain = useMemo(
    () => evmChains?.find?.((x) => x.chain_id === chain?.id),
    [chain, evmChains]
  );

  const isSticky = useIsSticky(100);

  return (
    <Navbar
      className={clsx("bg-base-100 sticky top-0 z-10 transition-all", {
        "bg-base-200 shadow-lg md:shadow-xl": isSticky,
      })}
    >
      <Navbar.Start>
        <LinkButton
          className="relative flex items-center gap-2 text-lg font-bold uppercase"
          ghost={true}
          onClick={() => router.push("/")}
        >
          <AxelarIcon className="h-6 w-6 dark:invert" />
          {process.env.NEXT_PUBLIC_NETWORK_ENV === "testnet" && (
            <Badge
              className="absolute -right-14 lowercase"
              size="xs"
              color="error"
              outline
            >
              testnet
            </Badge>
          )}
          {APP_NAME}
        </LinkButton>
      </Navbar.Start>
      <Navbar.End className="flex items-center gap-2">
        {isConnected && address ? (
          <>
            <EVMChainsDropdown
              onSwitchNetwork={switchNetworkAsync}
              selectedChain={selectedChain}
              chains={evmChains}
            />
            <CopyToClipboardButton size="sm" copyText={address} outline={true}>
              {maskAddress(address)}
            </CopyToClipboardButton>
            <Button size="sm" onClick={() => disconnect()}>
              Disconnect
            </Button>
          </>
        ) : (
          <ConnectWalletButton />
        )}
        <ThemeSwitcher />
      </Navbar.End>
    </Navbar>
  );
};

export default Appbar;
