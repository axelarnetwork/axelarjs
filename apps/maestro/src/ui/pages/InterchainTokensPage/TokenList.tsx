import { Card, CopyToClipboardButton } from "@axelarjs/ui";
import tw from "@axelarjs/ui/tw";
import { maskAddress, Maybe } from "@axelarjs/utils";
import { useMemo, useState, type FC } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";

import { filter, map } from "rambda";

import { CHAIN_CONFIGS } from "~/config/chains";
import { trpc } from "~/lib/trpc";
import { useAllChainConfigsQuery } from "~/services/axelarscan/hooks";
import { ChainIcon } from "~/ui/components/ChainsDropdown";
import Pagination from "~/ui/components/Pagination";
import Page from "~/ui/layouts/Page";

const useGetMyInterchainTokensQuery =
  trpc.interchainToken.getMyInterchainTokens.useQuery;

function getChainNameSlug(chainId: number) {
  const chain = CHAIN_CONFIGS.find((chain) => chain.id === chainId);

  return chain?.axelarChainName.toLowerCase() ?? "";
}

const InterchainTokenDeployment = dynamic(
  () => import("~/features/InterchainTokenDeployment")
);

const PAGE_LIMIT = 15;

const PAGE_TITLE = "My Interchain Tokens";

const PageTitle = tw(Page.Title)`flex items-center gap-2`;

type TokenListProps = {
  sessionAddress?: `0x${string}`;
};

const TokenList: FC<TokenListProps> = ({ sessionAddress }) => {
  const [pageIndex, setPageIndex] = useState(0);
  const offset = pageIndex * PAGE_LIMIT;

  const { data, isFetched } = useGetMyInterchainTokensQuery(
    {
      sessionAddress: sessionAddress as `0x${string}`,
      limit: PAGE_LIMIT,
      offset,
    },
    {
      suspense: true,
      enabled: Boolean(sessionAddress),
    }
  );

  const { combinedComputed } = useAllChainConfigsQuery();

  const maybeTokens = Maybe.of(data).map((data) => data.items);
  const totalPages = Maybe.of(data).mapOr(0, (data) => data.totalPages);

  const filteredTokens = useMemo(
    () =>
      maybeTokens
        .map(
          map(
            (token) =>
              [
                token,
                combinedComputed.indexedById[token.axelarChainId],
              ] as const
          )
        )
        .mapOr(
          [],
          filter(([token, chain]) => Boolean(token) && Boolean(chain))
        ),
    [combinedComputed.indexedById, maybeTokens]
  );

  const totalTokens = Maybe.of(data).mapOr(0, (data) => data.totalItems);

  if (isFetched && !totalTokens) {
    return <EmptyState />;
  }

  return (
    <>
      <PageTitle>
        {PAGE_TITLE}
        {Boolean(filteredTokens?.length) && (
          <span className="text-base-content-secondary font-mono text-base">
            (
            {totalPages > 1 ? (
              <>
                {offset + 1}-{offset + filteredTokens.length} of {totalTokens}
              </>
            ) : (
              totalTokens
            )}
            )
          </span>
        )}
      </PageTitle>
      <ul className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {filteredTokens.map(([token, chain]) => {
          const href = `/${getChainNameSlug(chain.chain_id)}/${
            token.tokenAddress
          }`;
          return (
            <li
              key={`${token.tokenAddress}:${token.tokenId}`}
              className="list-item"
            >
              <Link href={href}>
                <Card className="bg-base-200" $compact>
                  <Card.Body>
                    <Card.Title>
                      <ChainIcon src={chain.image} size="sm" alt={chain.name} />{" "}
                      {token.tokenName}
                    </Card.Title>
                    <Card.Actions className="justify-between">
                      <CopyToClipboardButton
                        copyText={token.tokenAddress}
                        $variant="ghost"
                        $length="block"
                        $size="sm"
                        className="bg-base-300 dark:bg-base-100"
                      >
                        {maskAddress(token.tokenAddress as `0x${string}`, {
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
      <Pagination
        page={pageIndex}
        onPageChange={setPageIndex}
        hasNextPage={pageIndex < totalPages - 1}
        hasPrevPage={pageIndex > 0}
      />
    </>
  );
};

const EmptyState = () => (
  <>
    <PageTitle>
      {PAGE_TITLE}
      <span className="text-base-content-secondary font-mono text-base">
        (0)
      </span>
    </PageTitle>
    <Card className="grid flex-1 place-items-center" $compact>
      <Card.Body className="borde grid place-items-center gap-4">
        <Card.Title className="text-center">
          {"Looks like you haven't deployed any token yet"}
        </Card.Title>
        <InterchainTokenDeployment />
      </Card.Body>
    </Card>
  </>
);

export default TokenList;
