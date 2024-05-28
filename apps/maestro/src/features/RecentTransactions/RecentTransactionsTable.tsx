import { Card, ExternalLinkIcon, Table, Tooltip } from "@axelarjs/ui";
import { maskAddress } from "@axelarjs/utils";
import { capitalize } from "@axelarjs/utils/string";
import { useEffect, useMemo, useState, type FC } from "react";
import Link from "next/link";

import { useAccount } from "wagmi";

import { NEXT_PUBLIC_EXPLORER_URL } from "~/config/env";
import {
  decodeDeploymentMessageId,
  type DeploymentMessageId,
  type InterchainToken,
} from "~/lib/drizzle/schema";
import { trpc } from "~/lib/trpc";
import type { RecentTransactionsOutput } from "~/server/routers/gmp/getRecentTransactions";
import Pagination from "~/ui/components/Pagination";
import { CONTRACT_METHODS_LABELS } from "./RecentTransactions";
import { CONTRACT_METHODS, type ContractMethod } from "./types";

type Props = {
  contractMethod?: ContractMethod;
  maxTransactions?: number;
  isTokensTable?: boolean;
};

export const RecentTransactionsTable: FC<Props> = ({
  contractMethod = CONTRACT_METHODS[0],
  maxTransactions = 10,
  isTokensTable = false,
}) => {
  const [page, setPage] = useState(0);
  const { address: senderAddress } = useAccount();

  // reset page when contract method changes
  useEffect(() => {
    setPage(0);
  }, [contractMethod]);

  const useGetInterchainTokensQuery =
    trpc.interchainToken.getInterchainTokens.useQuery;
  const { data: interchainDeployments, isLoading: isLoadingTokens } =
    useGetInterchainTokensQuery(
      {
        limit: 20,
        offset: 20 * page,
      },
      {
        suspense: true,
        enabled: true,
      }
    );

  const { data: txns, isLoading } = trpc.gmp.getRecentTransactions.useQuery(
    {
      contractMethod,
      senderAddress,
      pageSize: maxTransactions,
      page,
    },
    {
      suspense: true,
    }
  );

  const { data: prevPageTxns } = trpc.gmp.getRecentTransactions.useQuery(
    {
      contractMethod,
      senderAddress,
      pageSize: maxTransactions,
      page: page > 0 ? page - 1 : 0,
    },
    {
      suspense: true,
    }
  );

  const { data: nextPageTxns } = trpc.gmp.getRecentTransactions.useQuery({
    contractMethod,
    senderAddress,
    pageSize: maxTransactions,
    page: page + 1,
  });

  const hasNextPage = isTokensTable
    ? !!interchainDeployments && interchainDeployments.totalPages > page
    : Number(nextPageTxns?.length) > 0;
  const hasPrevPage = page > 0 && Number(prevPageTxns?.length) > 0;

  const columns = [
    {
      label: "Token",
      accessor: "contractMethod",
      className:
        "from-base-300 via-base-300/70 to-base-300/25 sticky left-0 bg-gradient-to-r md:bg-none",
    },
    {
      label: isTokensTable ? "Token Type" : "Hash",
      accessor: isTokensTable ? "tokenType" : "hash",
    },
    {
      label: "Timestamp",
      accessor: "timestamp",
    },
  ];

  const paginationBlock = useMemo(
    () =>
      hasNextPage || hasPrevPage ? (
        <Table.Row>
          <Table.Cell colSpan={columns.length}>
            <Pagination
              page={page}
              onPageChange={setPage}
              hasNextPage={hasNextPage}
              hasPrevPage={hasPrevPage}
            />
          </Table.Cell>
        </Table.Row>
      ) : null,
    [columns.length, hasNextPage, hasPrevPage, page]
  );

  return (
    <Card className="bg-base-200/50 no-scrollbar max-w-[95vw] overflow-scroll rounded-lg">
      <Card.Body>
        <Table className="relative space-y-4" $zebra>
          <Table.Head>
            <Table.Row>
              <Table.Column
                colSpan={columns.length}
                className="text-center text-base"
              >
                {isTokensTable ? (
                  <span>
                    Recently Deployed{" "}
                    <span className="text-accent">Interchain Tokens</span>
                  </span>
                ) : (
                  <>
                    Recent{" "}
                    <span className="text-accent">
                      {CONTRACT_METHODS_LABELS[contractMethod]}
                    </span>{" "}
                    Transactions
                  </>
                )}
              </Table.Column>
            </Table.Row>
            <Table.Row>
              {columns.map((column) => (
                <Table.Column key={column.label} className={column.className}>
                  {column.label}
                </Table.Column>
              ))}
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {(isTokensTable ? isLoadingTokens : isLoading) ? (
              <Table.Row className="grid min-h-[38px] place-items-center  text-center">
                <Table.Cell colSpan={3}>
                  {isLoading
                    ? "Loading transactions..."
                    : "No transactions found"}
                </Table.Cell>
              </Table.Row>
            ) : isTokensTable ? (
              interchainDeployments?.items.map((token) => (
                <InterchainTokenRow key={token.tokenId} token={token} />
              ))
            ) : (
              txns?.length &&
              txns.map((tx, i) => (
                <TransactionRow
                  key={`${tx?.hash}-${i}`}
                  tx={tx}
                  contractMethod={contractMethod}
                />
              ))
            )}
            {paginationBlock}
          </Table.Body>
        </Table>
      </Card.Body>
    </Card>
  );
};

const TransactionRow: FC<{
  tx: RecentTransactionsOutput[number];
  contractMethod: ContractMethod;
}> = ({ tx }) => {
  return (
    <Table.Row>
      <Table.Cell className="from-base-300 via-base-300/70 to-base-300/25 sticky left-0 bg-gradient-to-r md:bg-none">
        <Link
          className="hover:text-primary hover:cursor-pointer"
          href={`/interchain-tokens/${tx.event?.tokenId}`}
        >
          {tx.event?.event === "InterchainTransfer"
            ? tx.event?.name
            : tx.event?.tokenName}{" "}
          <span className="opacity-75">
            (
            {tx.event?.event === "InterchainTransfer"
              ? tx.event?.symbol
              : tx.event?.tokenSymbol}
            )
          </span>
        </Link>
      </Table.Cell>
      <Table.Cell>
        <Tooltip tip="View on AxelarScan" $position="bottom">
          <Link
            className="group inline-flex items-center text-sm font-semibold hover:underline"
            href={`${NEXT_PUBLIC_EXPLORER_URL}/gmp/${tx?.hash}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {maskAddress(tx.hash)}{" "}
            <ExternalLinkIcon className="text-accent h-3 opacity-0 transition-opacity group-hover:opacity-100" />
          </Link>
        </Tooltip>
      </Table.Cell>
      <Table.Cell>{new Date(tx.timestamp * 1000).toLocaleString()}</Table.Cell>
    </Table.Row>
  );
};

const InterchainTokenRow: FC<{
  token: InterchainToken;
}> = ({ token }) => {
  return (
    <Table.Row>
      <Table.Cell className="from-base-300 via-base-300/70 to-base-300/25 sticky left-0 bg-gradient-to-r md:bg-none">
        <Tooltip tip="View on AxelarScan" $position="bottom">
          <Link
            className="group inline-flex items-center text-sm font-semibold hover:underline"
            href={`${NEXT_PUBLIC_EXPLORER_URL}/gmp/${decodeDeploymentMessageId(token?.deploymentMessageId as DeploymentMessageId).hash}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {token.tokenName}&nbsp;
            <span className="opacity-75"> ({token.tokenSymbol})</span>
            <ExternalLinkIcon className="text-accent h-3 opacity-0 transition-opacity group-hover:opacity-100" />
          </Link>
        </Tooltip>
      </Table.Cell>
      <Table.Cell>{capitalize(token.kind)}</Table.Cell>
      <Table.Cell>{token.createdAt?.toLocaleString()}</Table.Cell>
    </Table.Row>
  );
};

export default RecentTransactionsTable;
