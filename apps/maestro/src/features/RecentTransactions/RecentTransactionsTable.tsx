import { Card, ExternalLinkIcon, Table, Tooltip } from "@axelarjs/ui";
import { maskAddress } from "@axelarjs/utils";
import { useEffect, useMemo, useState, type FC } from "react";
import Link from "next/link";

import { type Address } from "wagmi";

import { NEXT_PUBLIC_EXPLORER_URL } from "~/config/env";
import { trpc } from "~/lib/trpc";
import type { RecentTransactionsOutput } from "~/server/routers/gmp/getRecentTransactions";
import Pagination from "~/ui/components/Pagination";
import { CONTRACT_METHODS_LABELS } from "./RecentTransactions";
import { type ContractMethod } from "./types";

type Props = {
  contractMethod: ContractMethod;
  senderAddress?: Address;
  maxTransactions?: number;
};

export const RecentTransactionsTable: FC<Props> = ({
  contractMethod,
  senderAddress,
  maxTransactions = 10,
}) => {
  const [page, setPage] = useState(0);

  // reset page when contract method changes
  useEffect(() => {
    setPage(0);
  }, [contractMethod]);

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

  const hasNextPage = Number(nextPageTxns?.length) > 0;
  const hasPrevPage = page > 0 && Number(prevPageTxns?.length) > 0;

  const columns = [
    {
      label: "Token",
      accessor: "contractMethod",
      className:
        "from-base-300 via-base-300/70 to-base-300/25 sticky left-0 bg-gradient-to-r md:bg-none",
    },
    {
      label: "Hash",
      accessor: "hash",
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
        <Table className="relative space-y-4" zebra>
          <Table.Head>
            <Table.Row>
              <Table.Column
                colSpan={columns.length}
                className="text-center text-base"
              >
                Recent{" "}
                <span className="text-accent">
                  {CONTRACT_METHODS_LABELS[contractMethod]}
                </span>{" "}
                Transactions
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
            {isLoading || !txns?.length ? (
              <Table.Row className="grid min-h-[38px] place-items-center  text-center">
                <Table.Cell colSpan={3}>
                  {isLoading
                    ? "Loading transactions..."
                    : "No transactions found"}
                </Table.Cell>
              </Table.Row>
            ) : (
              txns.map((tx, i) => (
                <TransactionRow
                  key={`${tx.hash}-${i}`}
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
        <Tooltip tip="View on AxelarScan" position="bottom">
          <Link
            className="group inline-flex items-center text-sm font-semibold hover:underline"
            href={`${NEXT_PUBLIC_EXPLORER_URL}/gmp/${tx.hash}`}
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

export default RecentTransactionsTable;
