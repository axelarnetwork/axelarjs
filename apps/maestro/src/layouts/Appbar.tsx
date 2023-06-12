import {
  AxelarIcon,
  Button,
  CopyToClipboardButton,
  Dropdown,
  Identicon,
  LinkButton,
  Navbar,
  ThemeSwitcher,
  useIsSticky,
} from "@axelarjs/ui";
import { maskAddress } from "@axelarjs/utils";
import React, { useEffect, useMemo, type FC } from "react";
import { useRouter } from "next/router";

import clsx from "clsx";
import { MenuIcon } from "lucide-react";
import { useAccount, useDisconnect, useNetwork, useSwitchNetwork } from "wagmi";

import EVMChainsDropdown from "~/components/EVMChainsDropdown";
import ConnectWalletButton from "~/compounds/ConnectWalletButton/ConnectWalletButton";
import { APP_NAME } from "~/config/app";
import { useEVMChainConfigsQuery } from "~/services/axelarscan/hooks";
import { useLayoutStateContainer } from "./MainLayout.state";

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

  const [state, actions] = useLayoutStateContainer();

  useEffect(
    () => {
      actions.setDrawerSideContent(() => (
        <div className="flex h-full flex-col gap-4">
          <div className="flex gap-2 px-0 py-2">
            <AxelarIcon className="h-6 w-6 dark:invert" />
            <span>{APP_NAME}</span>
          </div>
          <>
            {isConnected && address ? (
              <>
                <CopyToClipboardButton
                  size="sm"
                  copyText={address}
                  outline={true}
                  className="flex items-center gap-2"
                >
                  <Identicon address={address ?? ""} diameter={18} />{" "}
                  {maskAddress(address)}
                </CopyToClipboardButton>
                <Button size="sm" onClick={() => disconnect()}>
                  Disconnect
                </Button>
              </>
            ) : (
              <ConnectWalletButton />
            )}
          </>
          <div className="absolute right-4 top-6">
            <ThemeSwitcher />
          </div>
        </div>
      ));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isConnected]
  );

  return (
    <Navbar
      className={clsx("bg-base-100 fixed top-0 px-2 transition-all md:px-6", {
        "bg-base-200/80 shadow-lg backdrop-blur-sm md:shadow-xl": isSticky,
        "z-10": isSticky && !state.isDrawerOpen,
      })}
    >
      <Navbar.Start>
        <Button
          shape="square"
          onClick={actions.toggleDrawer}
          aria-label="Toggle Drawer"
          size="sm"
          className="hover:bg-base-300/50 active:bg-base-300 rounded-lg transition-all md:hidden"
        >
          <MenuIcon className="h-6 w-6" />
        </Button>
        <LinkButton
          className="flex items-center gap-2 text-lg font-bold uppercase"
          onClick={() => router.push("/")}
          variant="ghost"
        >
          <AxelarIcon className="h-6 w-6 dark:invert" />
          <span>{APP_NAME}</span>
        </LinkButton>
      </Navbar.Start>
      <Navbar.End>
        <div className="hidden items-center gap-2 md:flex">
          <EVMChainsDropdown
            onSwitchNetwork={switchNetworkAsync}
            selectedChain={selectedChain}
            chains={evmChains}
            triggerClassName="w-full md:w-auto rounded-full"
            chainIconClassName="-translate-x-1.5"
          />
          {isConnected && address ? (
            <Dropdown align="end">
              <Dropdown.Trigger>
                <button className="grid h-6 w-6 place-items-center rounded-full hover:ring focus:ring">
                  <Identicon address={address ?? ""} diameter={18} />
                </button>
              </Dropdown.Trigger>
              <Dropdown.Content className="dark:bg-base-200 mt-2 grid max-h-[80vh] w-full gap-4 p-4 md:w-48">
                <>
                  <CopyToClipboardButton
                    size="sm"
                    copyText={address}
                    outline={true}
                    className="flex items-center gap-1"
                  >
                    <Identicon address={address ?? ""} diameter={18} />{" "}
                    {maskAddress(address)}
                  </CopyToClipboardButton>
                  <Button size="sm" color="error" onClick={() => disconnect()}>
                    Disconnect
                  </Button>
                </>
              </Dropdown.Content>
            </Dropdown>
          ) : (
            <ConnectWalletButton />
          )}
          <ThemeSwitcher />
        </div>
      </Navbar.End>
    </Navbar>
  );
};

export default Appbar;
