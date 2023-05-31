import React, { useEffect, useMemo, type FC } from "react";

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
import { MenuIcon } from "lucide-react";
import { useRouter } from "next/router";
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

  const AppbarEndContent = useMemo(() => {
    const Content = () => (
      <>
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
      </>
    );
    return Content;
  }, [
    address,
    disconnect,
    evmChains,
    isConnected,
    selectedChain,
    switchNetworkAsync,
  ]);

  const [, actions] = useLayoutStateContainer();

  useEffect(
    () => {
      actions.setDrawerSideContent(() => (
        <div className="flex flex-col gap-4">
          <AppbarEndContent />
        </div>
      ));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <Navbar
      className={clsx("bg-base-100 fixed top-0 z-10 transition-all", {
        "bg-base-200/80 shadow-lg backdrop-blur-sm md:shadow-xl": isSticky,
      })}
    >
      <Navbar.Start>
        <LinkButton
          className="flex items-center gap-2 text-lg font-bold uppercase"
          onClick={() => router.push("/")}
          ghost
        >
          <AxelarIcon className="h-6 w-6 dark:invert" />
          <span>{APP_NAME}</span>
        </LinkButton>
      </Navbar.Start>
      <Navbar.End>
        <div className="hidden items-center gap-2 md:flex">
          <AppbarEndContent />
        </div>
        <Button
          onClick={actions.toggleDrawer}
          aria-label="Toggle Drawer"
          className="!bg-opacity-5 md:hidden"
          ghost
        >
          <MenuIcon className="h-6 w-6" />
        </Button>
      </Navbar.End>
    </Navbar>
  );
};

export default Appbar;
