import { Card, CopyToClipboardButton } from "@axelarjs/ui";
import { maskAddress, Maybe } from "@axelarjs/utils";
import { useMemo, type FC } from "react";
import Link from "next/link";

import { filter, map } from "rambda";

import { WAGMI_CHAIN_CONFIGS } from "~/config/wagmi";
import { trpc } from "~/lib/trpc";
import { useEVMChainConfigsQuery } from "~/services/axelarscan/hooks";
import { ChainIcon } from "~/ui/components/EVMChainsDropdown";
import Page from "~/ui/layouts/Page";

const useGetMyInterchainTokensQuery =
  trpc.interchainToken.getMyInterchainTokens.useQuery;

function getChainNameSlug(chainId: number) {
  const chain = WAGMI_CHAIN_CONFIGS.find((chain) => chain.id === chainId);

  return chain?.axelarChainName.toLowerCase() ?? "";
}

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
              [token, computed.indexedById[token.axelarChainId]] as const
          )
        )
        .mapOr(
          [],
          filter(([token, chain]) => Boolean(token) && Boolean(chain))
        ),
    [computed.indexedById, data]
  );

  return (
    <>
      <Page.Title className="flex items-center gap-2">
        My Interchain Tokens
        {Boolean(filteredTokens?.length) && (
          <span className="text-base-content-secondary font-mono text-base">
            ({filteredTokens?.length})
          </span>
        )}
      </Page.Title>
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
    </>
  );
};

export default TokenList;
