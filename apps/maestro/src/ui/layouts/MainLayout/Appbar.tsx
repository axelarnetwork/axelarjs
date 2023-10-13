import {
  AxelarIcon,
  Badge,
  Button,
  Card,
  CopyToClipboardButton,
  Dropdown,
  ExternalLinkIcon,
  Indicator,
  LinkButton,
  MenuIcon,
  Navbar,
  ThemeSwitcher,
} from "@axelarjs/ui";
import { useIsSticky } from "@axelarjs/ui/hooks";
import { cn } from "@axelarjs/ui/utils";
import { maskAddress } from "@axelarjs/utils";
import React, { useEffect, type FC } from "react";
import Identicon, { jsNumberForAddress } from "react-jazzicon";
import Link from "next/link";
import { useRouter } from "next/router";

import { useAccount, useDisconnect, useNetwork } from "wagmi";

import { APP_NAME } from "~/config/app";
import EVMChainsDropdown from "~/ui/components/EVMChainsDropdown";
import ConnectWalletButton from "~/ui/compounds/ConnectWalletButton";
import { useLayoutStateContainer } from "./MainLayout.state";
import MainMenu from "./MainMenu";

export type AppbarProps = {
  className?: string;
};

const Appbar: FC<AppbarProps> = (props) => {
  const { disconnect } = useDisconnect();
  const { isConnected, address } = useAccount();
  const { chain } = useNetwork();

  const router = useRouter();

  const isSticky = useIsSticky(100);

  const [state, actions] = useLayoutStateContainer();

  const connectedAccountDetails = address ? (
    <>
      <CopyToClipboardButton
        size="sm"
        copyText={address}
        className="flex items-center gap-1"
      >
        <Identicon seed={jsNumberForAddress(address)} diameter={18} />{" "}
        {maskAddress(address)}
      </CopyToClipboardButton>
      <LinkButton
        size="sm"
        target="_blank"
        rel="noopener noreferrer"
        href={`${chain?.blockExplorers?.default.url}/address/${address}`}
        className="flex flex-nowrap items-center gap-1"
      >
        View on {chain?.blockExplorers?.default.name}{" "}
        <ExternalLinkIcon className="h-[1em] w-[1em]" />
      </LinkButton>

      <Link
        href="/interchain-tokens"
        className="btn btn-sm flex flex-nowrap text-center"
      >
        <Indicator>
          My Interchain Tokens
          <Indicator.Item
            $as={Badge}
            variant="info"
            size="xs"
            className="origin-center translate-x-4 animate-pulse"
          />
        </Indicator>
      </Link>
      <Button size="sm" variant="error" onClick={() => disconnect()}>
        Disconnect
      </Button>
    </>
  ) : null;

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
                <EVMChainsDropdown
                  contentClassName="max-h-[70dvh] w-[300px] translate-x-2"
                  triggerClassName="btn btn-block justify-between"
                />
                <Card className="bg-base-200" compact>
                  <Card.Body>{connectedAccountDetails}</Card.Body>
                </Card>
              </>
            ) : (
              <ConnectWalletButton />
            )}
          </>
          <div className="absolute right-4 top-6">
            <ThemeSwitcher />
          </div>
          <div className="flex-1" />
          <MainMenu />
        </div>
      ));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isConnected, address]
  );

  return (
    <Navbar
      className={cn(
        "bg-base-100 fixed top-0 px-2 transition-all md:px-6",
        {
          "bg-base-200/80 shadow-lg backdrop-blur-sm md:shadow-xl": isSticky,
          "z-10": isSticky && !state.isDrawerOpen,
        },
        props.className
      )}
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
          <Indicator>
            <span>{APP_NAME}</span>
            {process.env.NEXT_PUBLIC_NETWORK_ENV !== "mainnet" && (
              <Indicator.Item
                size="xs"
                variant="success"
                position="bottom"
                className="translate-x-2 translate-y-2 lowercase"
              >
                {process.env.NEXT_PUBLIC_NETWORK_ENV}
              </Indicator.Item>
            )}
          </Indicator>
        </LinkButton>
      </Navbar.Start>
      <div className="hidden flex-none md:block">
        <MainMenu direction="horizontal" />
      </div>
      <Navbar.End>
        <div className="hidden items-center gap-2 md:flex">
          {isConnected && address ? (
            <>
              <EVMChainsDropdown />
              <Dropdown align="end">
                <Dropdown.Trigger>
                  <button
                    className="grid h-6 w-6 place-items-center rounded-full hover:ring focus:ring"
                    aria-label="connected wallet dropdown trigger"
                  >
                    <Identicon
                      seed={jsNumberForAddress(address)}
                      diameter={18}
                    />
                  </button>
                </Dropdown.Trigger>
                <Dropdown.Content className="bg-base-100 dark:bg-base-200 mt-2 grid max-h-[80vh] w-full gap-2 p-3 md:w-48">
                  {connectedAccountDetails}
                </Dropdown.Content>
              </Dropdown>
            </>
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
