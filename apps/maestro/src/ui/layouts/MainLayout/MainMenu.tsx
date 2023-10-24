import { ArrowRightIcon, ExternalLinkIcon, Menu, Modal } from "@axelarjs/ui";
import tw from "@axelarjs/ui/tw";
import React, { type FC } from "react";
import Link from "next/link";

import {
  NEXT_PUBLIC_EXPLORER_URL,
  NEXT_PUBLIC_FILE_BUG_REPORT_URL,
  NEXT_PUBLIC_INTERCHAIN_TOKEN_SERVICE_ADDRESS,
} from "~/config/env";
import { TERMS_OF_USE_PARAGRAPHS } from "~/config/terms-of-use";

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

export const TOP_MENU_ITEMS: Menuitem[] = [
  {
    kind: "link",
    label: "My Interchain Tokens",
    href: "/interchain-tokens",
  },
  {
    kind: "link",
    label: "Recent Transactions",
    href: "/recent-transactions",
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
    kind: "modal",
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
    kind: "modal",
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
      <Menu.Item key={index}>
        {item.kind === "link" ? (
          <Link
            href={item.href}
            className="hover:text-accent inline-flex hover:underline lg:uppercase"
            rel={item.external ? "noopener noreferrer" : undefined}
            target={item.external ? "_blank" : undefined}
          >
            {item.label}{" "}
            {item.external && <ExternalLinkIcon className="h-[1em] w-[1em]" />}
          </Link>
        ) : (
          <Modal
            trigger={
              <a className="hover:text-accent hover:underline lg:uppercase">
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
      </Menu.Item>
    ))}
  </>
);

export default function MainMenu(
  props: Partial<React.ComponentProps<typeof Menu>>
) {
  return (
    <Menu {...props}>
      <MenuItems />
    </Menu>
  );
}
