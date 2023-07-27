import { Card, CopyToClipboardButton } from "@axelarjs/ui";
import { maskAddress, sluggify } from "@axelarjs/utils";
import Link from "next/link";

import { ChainIcon } from "~/components/EVMChainsDropdown";
import { EVM_CHAIN_CONFIGS } from "~/config/wagmi";
import Page from "~/layouts/Page";
import { trpc } from "~/lib/trpc";
import { useEVMChainConfigsQuery } from "~/services/axelarscan/hooks";

const getChainNameSlug = (chainId: number) => {
  const chain = EVM_CHAIN_CONFIGS.find((chain) => chain.id === chainId);

  return sluggify(chain?.name ?? "");
};

export type InterchainTokensPageProps = {};

export default function InterchainTokensPage() {
  const { data } = trpc.interchainToken.getMyInterchainTokens.useQuery();

  const { computed } = useEVMChainConfigsQuery();

  return (
    <Page pageTitle="My Interchain Tokens">
      <div className="flex flex-col gap-4">
        <Page.Title>My Interchain Tokens ({data?.length})</Page.Title>
        <ul className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {data?.map((token) => {
            const chain = computed.indexedByChainId[token.originChainId];

            return (
              <li
                key={`${token.tokenAddress}:${token.tokenId}`}
                className="list-item"
              >
                <Link
                  href={`/${getChainNameSlug(token.originChainId)}/${
                    token.tokenAddress
                  }`}
                >
                  <Card className="bg-base-200">
                    <Card.Body>
                      <Card.Title>
                        <ChainIcon
                          src={chain.image}
                          size="sm"
                          alt={chain.name}
                        />{" "}
                        {token.tokenName}
                      </Card.Title>

                      <CopyToClipboardButton>
                        {maskAddress(token.tokenAddress)}
                      </CopyToClipboardButton>
                    </Card.Body>
                  </Card>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </Page>
  );
}
