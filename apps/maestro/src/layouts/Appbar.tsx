import React, { useMemo, type FC } from "react";

import {
  AxelarIcon,
  Button,
  CopyToClipboardButton,
  LinkButton,
  Navbar,
  ThemeSwitcher,
  useIsSticky,
} from "@axelarjs/ui";
import { maskAddress } from "@axelarjs/utils";
import clsx from "clsx";
import { useRouter } from "next/router";
import { useAccount, useDisconnect, useNetwork, useSwitchNetwork } from "wagmi";

import EVMChainsDropdown from "~/components/EVMChainsDropdown";
import ConnectWalletButton from "~/compounds/ConnectWalletButton/ConnectWalletButton";
import { APP_NAME } from "~/config/app";
import { useEVMChainConfigsQuery } from "~/services/axelarscan/hooks";

export type AppbarProps = {};

const Appbar: FC<AppbarProps> = () => {
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
      className={clsx("bg-base-100 fixed top-0 z-10 transition-all", {
        "bg-base-200/80 shadow-lg backdrop-blur-sm md:shadow-xl": isSticky,
      })}
    >
      <Navbar.Start>
        <LinkButton
          className="flex items-center gap-2 text-lg font-bold uppercase"
          ghost={true}
          onClick={() => router.push("/")}
        >
          <AxelarIcon className="h-6 w-6 dark:invert" />
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
