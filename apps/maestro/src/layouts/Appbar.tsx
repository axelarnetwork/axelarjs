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
import Link from "next/link";
import { useRouter } from "next/router";

import clsx from "clsx";
import { ArrowRightIcon, ExternalLinkIcon, MenuIcon } from "lucide-react";
import tw from "tailwind-styled-components";
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

const Content = {
  Wrapper: tw.div`space-y-6`,
  Header: tw.header`text-primary font-bold uppercase`,
  Main: tw.main`space-y-4`,
  Article: tw.article`space-y-2`,
  Paragraph: tw.p`text-base`,
  ArrowIcon: () => (
    <div>
      <ArrowRightIcon size="1.25em" />
    </div>
  ),
  ExternalLink: ({ href = "", children = "" }) => (
    <Link
      rel="noopener noreferrer"
      href={href}
      className="text-accent inline-flex items-center gap-2 hover:underline"
    >
      {children} <ExternalLinkIcon size="1em" />
    </Link>
  ),
};

const MENU_ITEMS: Menuitem[] = [
  {
    label: "Getting started",
    ModalContent: () => (
      <Content.Wrapper>
        <Content.Article>
          <Content.Header>
            BRIDGES HAVE THEIR HAVE THEIR LIMITS LIMITS
          </Content.Header>
          <Content.Main>
            <Content.Paragraph>
              Web3 has gone cross-chain, with assets bridging between
              blockchains and developers deploying applications everywhere.
            </Content.Paragraph>
            <Content.Paragraph>
              But bridged tokens lose their fungibility and their custom
              features. And it&apos;s costly to mint tokens on multiple chains.
            </Content.Paragraph>
          </Content.Main>
        </Content.Article>
        <Content.Article>
          <Content.Header>
            WHAT IS INTERCHAIN INTERCHAIN TOKEN TOKEN SERVICE? SERVICE?
          </Content.Header>
          <Content.Main>
            <Content.Paragraph>
              Axelar introduces Interchain Token Service (ITS), supporting
              Interchain Tokens that preserve cross-chain fungibility and custom
              functionality.
            </Content.Paragraph>
            <Content.Paragraph>
              ITS is a product suite that extends tokens cross-chain, preserving
              native qualities while allowing teams to easily manage supply and
              features through the creation of Interchain Tokens.
            </Content.Paragraph>
          </Content.Main>
        </Content.Article>
      </Content.Wrapper>
    ),
  },
  {
    label: "Support",
    ModalContent: () => (
      <>
        <Content.Wrapper $as="ul">
          <Content.Article $as="li">
            <Content.Header>Transaction History</Content.Header>
            <Content.Main>
              <Link
                href={`${NEXT_PUBLIC_EXPLORER_URL}/gmp/search?contractAddress=${NEXT_PUBLIC_INTERCHAIN_TOKEN_SERVICE_ADDRESS}`}
                className="hover:text-primary flex gap-4"
                rel="noopener noreferrer"
                target="_blank"
              >
                <Content.Paragraph className="text-sm">
                  Search Axelarscan for any transactions you made through the
                  Interchain Token Service. You can filter the transaction view
                  by the address you used to deploy your tokens.
                </Content.Paragraph>
                <Content.ArrowIcon />
              </Link>
            </Content.Main>
          </Content.Article>
          <Content.Article $as="li">
            <Content.Header>File a Bug Report</Content.Header>
            <Content.Main>
              <Link
                href={NEXT_PUBLIC_FILE_BUG_REPORT_URL}
                className="hover:text-primary flex gap-4"
                rel="noopener noreferrer"
                target="_blank"
              >
                <Content.Paragraph className="text-sm">
                  For general help, submit your questions/feedback via Zendesk.
                  Any and all thoughts welcome!
                </Content.Paragraph>
                <Content.ArrowIcon />
              </Link>
            </Content.Main>
          </Content.Article>
        </Content.Wrapper>
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

  {
    label: "F.A.Q.",
    ModalContent: () => (
      <Content.Wrapper>
        {FAQ_ITEMS.map(({ question, answer }, index) => (
          <Content.Article key={`q-${index}`} $as="details">
            <Content.Header $as="summary" className="cursor-pointer">
              {question}
            </Content.Header>
            <Content.Main>
              {answer.map((paragraph, index) => (
                <Content.Paragraph key={`p-${index}`}>
                  {paragraph}
                </Content.Paragraph>
              ))}
            </Content.Main>
          </Content.Article>
        ))}
      </Content.Wrapper>
    ),
  },
];

const FAQ_ITEMS = [
  {
    question: "What is Interchain Token Service?",
    answer: [
      "ITS is a product suite that extends tokens cross-chain, preserving native qualities while allowing teams to easily mint tokens, and manage supply and features through the creation of Interchain Tokens.",
    ],
  },
  {
    question: "My project’s development resources are limited. Can I use ITS?",
    answer: [
      "ITS includes smart contracts and an SDK that automate the complex developer tasks involved in minting and managing a token on multiple chains, minimizing overhead. ITS supports 1-click, permissionless deployments and transfers.",
    ],
  },
  {
    question: "What do Interchain Tokens deliver for the user?",
    answer: [
      "Interchain Tokens preserve fungibility, maximizing liquidity cross-chain – and, for custom tokens, they deliver the same functionality as any native token.",
    ],
  },
  {
    question: "What blockchains does ITS support?",
    answer: [
      "ITS supports any EVM-compatible blockchain that is integrated with the Axelar network.",
    ],
  },
  {
    question: "Are Interchain Tokens secure?",
    answer: [
      <>
        Interchain tokens are backed by proof-of-stake security underpinning the
        Axelar network, including the largest, dynamic validator set of any Web3
        interoperability network.{" "}
        <Content.ExternalLink href="https://axelar.network/blog/security-at-axelar-core">
          Learn more about Axelar security
        </Content.ExternalLink>
      </>,
    ],
  },
  {
    question: "Where do I go to start building an Interchain Token?",
    answer: [
      <>
        You can find everything you need to know to start deploying and managing
        Interchain Tokens in{" "}
        <Content.ExternalLink href="https://docs.axelar.dev/dev/send-tokens/interchain-tokens">
          Axelar’s documentation
        </Content.ExternalLink>
      </>,
    ],
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
