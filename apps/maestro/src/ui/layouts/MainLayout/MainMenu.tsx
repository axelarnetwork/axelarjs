import {
  ArrowRightIcon,
  Button,
  ExternalLinkIcon,
  Menu,
  Modal,
} from "@axelarjs/ui";
import tw from "@axelarjs/ui/tw";
import React, { type FC } from "react";
import Markdown from "react-markdown";
import Image from "next/image";
import Link from "next/link";

import {
  NEXT_PUBLIC_AXELAR_CONFIGS_URL,
  NEXT_PUBLIC_EXPLORER_URL,
  NEXT_PUBLIC_FILE_BUG_REPORT_URL,
  NEXT_PUBLIC_INTERCHAIN_TOKEN_SERVICE_ADDRESS,
} from "~/config/env";
import { TERMS_OF_USE_COPY } from "~/config/terms-of-use";

export type Menuitem =
  | {
      kind: "modal";
      label: string;
      ModalContent: FC;
    }
  | {
      kind: "link";
      label: string;
      href: string;
      external?: boolean;
    };

export const Content = {
  Wrapper: tw.div`space-y-6`,
  Header: tw.header`text-primary font-semibold uppercase`,
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
      className="inline-flex items-center gap-2 text-accent hover:underline"
    >
      {children} <ExternalLinkIcon size="1em" />
    </Link>
  ),
};

export const TOP_MENU_ITEMS: Menuitem[] = [
  {
    kind: "link",
    label: "My Interchain Tokens",
    href: "/interchain-tokens",
  },
  {
    kind: "link",
    label: "My Recent Transactions",
    href: "/recent-transactions",
  },
  {
    kind: "link",
    label: "Recent Deployments",
    href: "/recent-deployments",
  },
];

export const BOTTOM_MENU_ITEMS: Menuitem[] = [
  {
    kind: "link",
    label: "Docs",
    href: "https://docs.axelar.dev/dev/send-tokens/interchain-tokens",
    external: true,
  },
  {
    kind: "modal",
    label: "About",
    ModalContent: () => (
      <>
        <Modal.Title className="flex">
          <p className="px-14 py-6 text-center font-medium text-white">
            CREATE A TOKEN THAT CAN SCALE TO ANY CHAIN IN A FEW CLICKS
          </p>
        </Modal.Title>
        <Image
          src="/ilustrations/onboarding-image.png"
          alt="Interchain Banner Teaser"
          layout="responsive"
          width={100}
          height={50}
          objectFit="cover"
          className="h-auto w-full px-6 py-2"
        />
        <div className="flex justify-between ">
          <p className="w-32 text-center text-sm font-normal text-white">
            CONNECT YOUR WALLET
          </p>
          <p className="w-32 text-center text-sm font-normal text-white">
            CONFIGURE TOKEN SETTINGS
          </p>
          <p className="w-32 text-center text-sm font-normal text-white">
            DEPLOY TO THE PREFERRED CHAINS
          </p>
        </div>
        <div className="pt-10">
          <p className="text-lg text-primary">BRIDGES HAVE THEIR LIMITS</p>
          <p>
            Web3 has gone cross-chain, with assets bridging between blockchains
            and developers deploying applications everywhere. But bridged tokens
            lose their fungibility and their custom features. And it&apos;s
            costly to mint tokens on multiple chains.
          </p>
        </div>
        <div>
          <p className="text-lg text-primary">
            WHAT IS INTERCHAIN TOKEN SERVICE?
          </p>
          <p>
            Axelar introduces Interchain Token Service (ITS), supporting
            Interchain Tokens that preserve cross-chain fungibility and custom
            functionality.
          </p>
        </div>
        <p className="pb-10">
          ITS is a product suite that extends tokens cross-chain, preserving
          native qualities while allowing teams to easily manage supply and
          features through the creation of Interchain Tokens.
        </p>
      </>
    ),
  },
  {
    kind: "modal",
    label: "Support",
    ModalContent: () => (
      <>
        <Content.Wrapper $as="ul">
          <Content.Article $as="li">
            <Content.Header>Add your token to Squid!</Content.Header>
            <Content.Main>
              <Link
                href={NEXT_PUBLIC_AXELAR_CONFIGS_URL}
                className="flex gap-4 hover:text-primary"
                rel="noopener noreferrer"
                target="_blank"
              >
                <Content.Paragraph className="text-sm">
                  Create a pull request to this shared config repository. Once
                  approved, your tokens will automatically be shown on and
                  bridgeable on Squid!
                </Content.Paragraph>
                <Content.ArrowIcon />
              </Link>
            </Content.Main>
          </Content.Article>
          <Content.Article $as="li">
            <Content.Header>Transaction History</Content.Header>
            <Content.Main>
              <Link
                href={`${NEXT_PUBLIC_EXPLORER_URL}/gmp/search?contractAddress=${NEXT_PUBLIC_INTERCHAIN_TOKEN_SERVICE_ADDRESS}`}
                className="flex gap-4 hover:text-primary"
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
                className="flex gap-4 hover:text-primary"
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
          <Content.Article $as="li">
            <Content.Header>Clear Your Cache</Content.Header>
            <Content.Main>
              <Content.Paragraph className="text-sm">
                If you&apos;re experiencing issues with the Interchain Token
                Service, try clearing your cache. This will log you out out of
                the app, clear your local storage and session storage.
                <br />
                <Button
                  className="mt-2"
                  $length="block"
                  $size="sm"
                  onClick={() => {
                    window.localStorage.clear();
                    window.sessionStorage.clear();
                    window.location.reload();
                  }}
                >
                  Clear Cache
                </Button>
              </Content.Paragraph>
            </Content.Main>
          </Content.Article>
        </Content.Wrapper>
      </>
    ),
  },
  {
    kind: "modal",
    label: "Terms of Use",
    ModalContent: () => (
      <article className="prose max-h-[70dvh] overflow-y-scroll dark:prose-invert">
        <Markdown>{TERMS_OF_USE_COPY}</Markdown>
      </article>
    ),
  },
  {
    kind: "modal",
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
  {
    kind: "link",
    label: "Report Feedback",
    href: "https://axelar.zendesk.com/hc/en-us/requests/new",
    external: true,
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

export const MenuItems = ({ items = TOP_MENU_ITEMS }) => (
  <>
    {items.map((item, index) => (
      <li key={index}>
        {item.kind === "link" ? (
          <Link
            href={item.href}
            className="inline-flex uppercase hover:text-accent hover:underline"
            rel={item.external ? "noopener noreferrer" : undefined}
            target={item.external ? "_blank" : undefined}
          >
            {item.label}{" "}
            {item.external && <ExternalLinkIcon className="h-[1em] w-[1em]" />}
          </Link>
        ) : (
          <Modal
            trigger={
              <a className="uppercase hover:text-accent hover:underline">
                {item.label}
              </a>
            }
          >
            <Modal.Title>{item.label}</Modal.Title>
            <Modal.Body>
              {item.ModalContent && <item.ModalContent />}
            </Modal.Body>
          </Modal>
        )}
      </li>
    ))}
  </>
);

const MainMenu: FC<Partial<React.ComponentProps<typeof Menu>>> = (props) => (
  <Menu {...props}>
    <MenuItems />
  </Menu>
);

export default MainMenu;
