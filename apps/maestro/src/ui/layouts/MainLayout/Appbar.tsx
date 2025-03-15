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
  Tooltip,
} from "@axelarjs/ui";
import { useIsSticky } from "@axelarjs/ui/hooks";
import { cn } from "@axelarjs/ui/utils";
import { maskAddress } from "@axelarjs/utils";
import React, { useEffect, type FC } from "react";
import Identicon, { jsNumberForAddress } from "react-jazzicon";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

import { APP_NAME } from "~/config/app";
import { NEXT_PUBLIC_NETWORK_ENV } from "~/config/env";
import Transactions from "~/features/Transactions/Transactions";
import { STELAR_CHAIN_ID, useAccount, useDisconnect } from "~/lib/hooks";
import ChainsDropdown from "~/ui/components/ChainsDropdown";
import ConnectWalletModal from "~/ui/compounds/ConnectWalletModal/ConnectWalletModal";
import { useLayoutStateContainer } from "./MainLayout.state";
import MainMenu from "./MainMenu";

export type AppbarProps = {
  className?: string;
};

const Appbar: FC<AppbarProps> = (props) => {
  const { disconnect } = useDisconnect();
  const { isConnected, address } = useAccount();
  const { chain } = useAccount();
  const router = useRouter();

  const isSticky = useIsSticky(100);

  const [state, actions] = useLayoutStateContainer();

  const connectedAccountDetails = address ? (
    <>
      <CopyToClipboardButton
        $size="sm"
        copyText={address}
        className="flex items-center gap-1"
      >
        <Identicon seed={jsNumberForAddress(address)} diameter={18} />{" "}
        {maskAddress(address)}
      </CopyToClipboardButton>
      <Tooltip tip={`View account on ${chain?.blockExplorers?.default.name}`}>
        <LinkButton
          $size="sm"
          target="_blank"
          rel="noopener noreferrer"
          href={`${chain?.blockExplorers?.default.url}/address/${address}`}
          className="flex flex-nowrap items-center gap-1"
        >
          View on explorer
          <ExternalLinkIcon className="h-[1em] w-[1em]" />
        </LinkButton>
      </Tooltip>

      <Link
        href="/interchain-tokens"
        className="btn btn-sm flex flex-nowrap text-center"
      >
        <Indicator>
          My Interchain Tokens
          <Indicator.Item
            $as={Badge}
            $variant="info"
            $size="xs"
            className="origin-center translate-x-4 animate-pulse"
          />
        </Indicator>
      </Link>
      <Button $size="sm" $variant="error" onClick={() => disconnect()}>
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
                <ChainsDropdown
                  excludeChainIds={[STELAR_CHAIN_ID]}
                  contentClassName="max-h-[70dvh] w-[300px] translate-x-2"
                  triggerClassName="btn btn-block justify-between"
                />
                <Card className="bg-base-200" $compact>
                  <Card.Body>{connectedAccountDetails}</Card.Body>
                </Card>
              </>
            ) : (
              <ConnectWalletModal />
            )}
          </>
          <div className="flex-1" />
          {isConnected && <MainMenu />}
          <div className="flex justify-end">
            <ThemeSwitcher />
          </div>
        </div>
      ));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isConnected, address]
  );

  return (
    <Navbar
      className={cn(
        "fixed top-0 z-10 bg-base-200 px-2 transition-all md:px-6",
        {
          "bg-base-200/80 shadow-lg backdrop-blur-sm md:shadow-xl": isSticky,
          "z-10": isSticky && !state.isDrawerOpen,
        },
        props.className
      )}
    >
      <Navbar.Start>
        <Button
          $shape="square"
          onClick={actions.toggleDrawer}
          aria-label="Toggle Drawer"
          $size="sm"
          className="rounded-lg transition-all hover:bg-base-300/50 active:bg-base-300"
        >
          <MenuIcon className="h-6 w-6" />
        </Button>
        <LinkButton
          className="text-md flex items-center gap-2 font-semibold uppercase sm:text-lg"
          onClick={() => router.push("/")}
          $variant="ghost"
        >
          <Image
            src="/logos/logo_axelar_full.svg"
            width={200}
            height={20}
            className="h-6 w-auto dark:invert"
            alt="axelar logo"
          />
          <Indicator>
            <span>{APP_NAME}</span>
            {NEXT_PUBLIC_NETWORK_ENV !== "mainnet" ? (
              <Indicator.Item
                $size="xs"
                $variant="success"
                $position="bottom"
                className="translate-x-2 translate-y-4 lowercase sm:translate-y-2"
              >
                {NEXT_PUBLIC_NETWORK_ENV}
              </Indicator.Item>
            ) : (
              <Indicator.Item
                $size="xs"
                $variant="primary"
                $position="bottom"
                className="translate-x-2 translate-y-2 lowercase"
              >
                beta
              </Indicator.Item>
            )}
          </Indicator>
        </LinkButton>
      </Navbar.Start>
      <Navbar.End>
        <div className="hidden items-center gap-2 md:flex">
          {isConnected && address ? (
            <>
              <ChainsDropdown excludeChainIds={[STELAR_CHAIN_ID]} />
              <Dropdown $align="end">
                <Dropdown.Trigger>
                  <button
                    className="grid place-items-center rounded-full hover:ring focus:ring"
                    aria-label="connected wallet dropdown trigger"
                  >
                    <div className="flex items-center p-2">
                      <Identicon
                        seed={jsNumberForAddress(address)}
                        diameter={18}
                      />
                      <p className="ml-2 text-sm">{maskAddress(address)}</p>
                    </div>
                  </button>
                </Dropdown.Trigger>
                <Dropdown.Content className="mt-2 grid max-h-[80vh] w-full gap-2 bg-base-100 p-3 dark:bg-base-200 md:w-48">
                  {connectedAccountDetails}
                </Dropdown.Content>
              </Dropdown>
            </>
          ) : (
            <ConnectWalletModal $size="sm" />
          )}
          <ThemeSwitcher />

          <Transactions />
        </div>
      </Navbar.End>
    </Navbar>
  );
};

export default Appbar;
