import {
  AxelarIcon,
  Button,
  Card,
  CopyToClipboardButton,
  Dropdown,
  Identicon,
  Indicator,
  LinkButton,
  Menu,
  Modal,
  Navbar,
  ThemeSwitcher,
  useIsSticky,
} from "@axelarjs/ui";
import { maskAddress } from "@axelarjs/utils";
import React, { useEffect, type FC } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";

import clsx from "clsx";
import { ArrowRightIcon, ExternalLinkIcon, MenuIcon } from "lucide-react";
import { useAccount, useDisconnect, useNetwork } from "wagmi";

import EVMChainsDropdown from "~/components/EVMChainsDropdown";
import ConnectWalletButton from "~/compounds/ConnectWalletButton/ConnectWalletButton";
import { APP_NAME } from "~/config/app";
import {
  NEXT_PUBLIC_EXPLORER_URL,
  NEXT_PUBLIC_FILE_BUG_REPORT_URL,
  NEXT_PUBLIC_INTERCHAIN_TOKEN_SERVICE_ADDRESS,
} from "~/config/env";
import { TERMS_OF_USE_PARAGRAPHS } from "~/config/terms-of-use";
import { useSession } from "~/services/auth";
import { useLayoutStateContainer } from "./MainLayout.state";

export type AppbarProps = {};

const Appbar: FC<AppbarProps> = () => {
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
        outline={true}
        className="flex items-center gap-1"
      >
        <Identicon address={address ?? ""} diameter={18} />{" "}
        {maskAddress(address)}
      </CopyToClipboardButton>
      <LinkButton
        size="sm"
        variant="info"
        outline
        target="_blank"
        rel="noopener noreferrer"
        href={`${chain?.blockExplorers?.default.url}/address/${address}`}
        className="flex flex-nowrap items-center gap-1"
      >
        View on {chain?.blockExplorers?.default.name}{" "}
        <ExternalLinkIcon className="h-[1em] w-[1em]" />
      </LinkButton>
      <Button size="sm" variant="error" onClick={() => disconnect()}>
        Disconnect
      </Button>
    </>
  ) : null;

  const { data: session, status: sessionStatus } = useSession();

  useEffect(() => {
    if (
      sessionStatus === "success" && // session is loaded
      address && // and the wallet is connected
      (!session || // and there is no session
        session?.address !== address) // or session address is different from connected address
    ) {
      // then sign in with the connected address
      signIn("credentials", { address });
      console.log(`signed in with ${address}`);
    }
  }, [session, address, sessionStatus]);

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
          <Menu>
            <MenuItems />
          </Menu>
        </div>
      ));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isConnected, address]
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
        <Menu direction="horizontal">
          <MenuItems />
        </Menu>
      </div>
      <Navbar.End>
        <div className="hidden items-center gap-2 md:flex">
          {isConnected && address ? (
            <>
              <EVMChainsDropdown
                triggerClassName="w-full md:w-auto rounded-full"
                chainIconClassName="-translate-x-1.5"
              />
              <Dropdown align="end">
                <Dropdown.Trigger>
                  <button
                    className="grid h-6 w-6 place-items-center rounded-full hover:ring focus:ring"
                    aria-label="connected wallet dropdown trigger"
                  >
                    <Identicon address={address ?? ""} diameter={18} />
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

type Menuitem = {
  label: string;
  ModalContent: FC;
};

const MENU_ITEMS: Menuitem[] = [
  {
    label: "Getting started",
    ModalContent: () => (
      <article className="grid gap-2">
        <header className="font-bold uppercase">
          What is an Interchain Token?
        </header>
        <main className="grid gap-4">
          <p>
            Axelar introduces the Interchain Token Standard to extend ERC-20
            compatibility across Web3. Now, you can easily make any token an
            interchain token.
          </p>
          <p>
            Unlock seamless blockchain interoperability with the Interchain
            Token Standard. Our standards and protocols enable frictionless
            token transfers and interactions across diverse blockchain networks.
            Embrace a decentralized ecosystem where tokens flow freely,
            transcending individual chains. Join our community of innovators
            driving the future of interconnected blockchains.
          </p>
        </main>
      </article>
    ),
  },
  {
    label: "Support",
    ModalContent: () => (
      <>
        <ul className="grid gap-4">
          <li>
            <article className="grid gap-2">
              <header className="font-bold uppercase">
                Transaction History
              </header>
              <main>
                <Link
                  href={`${NEXT_PUBLIC_EXPLORER_URL}/gmp/search?contractAddress=${NEXT_PUBLIC_INTERCHAIN_TOKEN_SERVICE_ADDRESS}`}
                  className="hover:text-primary flex gap-2"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <span className="text-sm">
                    Search Axelarscan for any transactions you made through
                    Maestro. You can filter the transaction view by the address
                    you used to deploy your tokens.
                  </span>
                  <ArrowRightIcon />
                </Link>
              </main>
            </article>
          </li>
          <li>
            <article className="grid gap-2">
              <header className="text-lg font-bold uppercase">
                File a Bug Report
              </header>
              <main>
                <Link
                  href={NEXT_PUBLIC_FILE_BUG_REPORT_URL}
                  className="hover:text-primary flex gap-2"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <span className="text-sm">
                    For general help, submit your questions/feedback via
                    Zendesk. Any and all thoughts welcome!
                  </span>
                  <ArrowRightIcon />
                </Link>
              </main>
            </article>
          </li>
        </ul>
      </>
    ),
  },
  {
    label: "Terms of Use",
    ModalContent: () => (
      <article className="prose dark:prose-invert max-h-[70dvh] overflow-y-scroll">
        {TERMS_OF_USE_PARAGRAPHS.map((paragraph, index) => (
          <p className="text-sm" key={index}>
            {paragraph}
          </p>
        ))}
      </article>
    ),
  },
];

const MenuItems = () => (
  <>
    {MENU_ITEMS.map((item, index) => (
      <Menu.Item key={index}>
        <Modal
          trigger={<a className="lg:uppercase lg:underline">{item.label}</a>}
        >
          <Modal.Title>{item.label}</Modal.Title>
          <Modal.Body>{item.ModalContent && <item.ModalContent />}</Modal.Body>
        </Modal>
      </Menu.Item>
    ))}
  </>
);
