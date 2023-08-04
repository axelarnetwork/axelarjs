import { Card, CopyToClipboardButton } from "@axelarjs/ui";
import { maskAddress, Maybe, sluggify } from "@axelarjs/utils";
import { Suspense, useMemo, type FC } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

import { filter, map, sortBy } from "rambda";

import { ChainIcon } from "~/components/EVMChainsDropdown";
import { EVM_CHAIN_CONFIGS } from "~/config/wagmi";
import Page from "~/layouts/Page";
import { withRouteProtection } from "~/lib/auth";
import { trpc } from "~/lib/trpc";
import { useEVMChainConfigsQuery } from "~/services/axelarscan/hooks";

const useGetMyInterchainTokensQuery =
  trpc.interchainToken.getMyInterchainTokens.useQuery;

const getChainNameSlug = (chainId: number) => {
  const chain = EVM_CHAIN_CONFIGS.find((chain) => chain.id === chainId);

  return sluggify(chain?.name ?? "");
};

export type InterchainTokensPageProps = {};

const InterchainTokensPage = () => {
  const { data: session } = useSession();

  const { data } = useGetMyInterchainTokensQuery(
    {
      sessionAddress: session?.address as `0x${string}`,
    },
    {
      suspense: true,
      enabled: Boolean(session?.address),
    }
  );
  return (
    <Page pageTitle="My Interchain Tokens">
      <div className="flex flex-col gap-4">
        <Page.Title className="flex items-center gap-2">
          My Interchain Tokens
          {Boolean(data?.length) && (
            <span className="text-base-content-secondary font-mono text-base">
              ({data?.length})
            </span>
          )}
        </Page.Title>
        <Suspense fallback={<div>Loading...</div>}>
          <TokenList sessionAddress={session?.address} />
        </Suspense>
      </div>
    </Page>
  );
};

type TokenListProps = {
  sessionAddress?: `0x${string}`;
};

const TokenList: FC<TokenListProps> = ({ sessionAddress }) => {
  const { data } = useGetMyInterchainTokensQuery(
    {
      sessionAddress: sessionAddress as `0x${string}`,
    },
    {
      suspense: true,
      enabled: Boolean(sessionAddress),
    }
  );

  const { computed } = useEVMChainConfigsQuery();

  const filteredTokens = useMemo(
    () =>
      Maybe.of(data)
        .map(
          map(
            (token) =>
              [token, computed.indexedByChainId[token.originChainId]] as const
          )
        )
        .map(filter(([token, chain]) => Boolean(token) && Boolean(chain)))
        .map(sortBy(([token]) => token.tokenAddress))
        .mapOr(
          [],
          sortBy(([, chain]) => chain.id)
        ),
    [computed.indexedByChainId, data]
  );

  return (
    <ul className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
      {filteredTokens.map(([token, chain]) => {
        const href = `/${getChainNameSlug(token.originChainId)}/${
          token.tokenAddress
        }`;
        return (
          <li
            key={`${token.tokenAddress}:${token.tokenId}`}
            className="list-item"
          >
            <Link href={href}>
              <Card className="bg-base-200" compact>
                <Card.Body>
                  <Card.Title>
                    <ChainIcon src={chain.image} size="sm" alt={chain.name} />{" "}
                    {token.tokenName}
                  </Card.Title>

                  <Card.Actions className="justify-between">
                    <CopyToClipboardButton
                      copyText={token.tokenAddress}
                      variant="ghost"
                      length="block"
                      size="sm"
                      className="bg-base-300 dark:bg-base-100"
                    >
                      {maskAddress(token.tokenAddress, {
                        segmentA: 10,
                        segmentB: -10,
                      })}
                    </CopyToClipboardButton>
                  </Card.Actions>
                </Card.Body>
              </Card>
            </Link>
          </li>
        );
      })}
    </ul>
  );
};

export default withRouteProtection(InterchainTokensPage);
