import { Button, ExternalLinkIcon, Table } from "@axelarjs/ui";
import { maskAddress } from "@axelarjs/utils";
import { useEffect, useMemo, useState, type FC } from "react";
import Link from "next/link";

import { type Address } from "wagmi";

import { trpc } from "~/lib/trpc";
import type { RecentTransactionsOutput } from "~/server/routers/gmp/getRecentTransactions";
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

  const { data: txns, isLoading } = trpc.gmp.getRecentTransactions.useQuery({
    contractMethod,
    senderAddress,
    pageSize: maxTransactions,
    page,
  });

  const { data: prevPageTxns } = trpc.gmp.getRecentTransactions.useQuery({
    contractMethod,
    senderAddress,
    pageSize: maxTransactions,
    page: page > 0 ? page - 1 : 0,
  });

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
      label: "Block",
      accessor: "blockNumber",
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
            <div>
              <div className="join flex items-center justify-center">
                <Button
                  aria-label="previous page"
                  size="sm"
                  disabled={!hasPrevPage}
                  onClick={setPage.bind(null, page - 1)}
                  className="join-item disabled:opacity-50"
                >
                  «
                </Button>
                <Button size="sm" className="join-item">
                  Page {page + 1}
                </Button>
                <Button
                  aria-label="next page"
                  size="sm"
                  disabled={!hasNextPage}
                  onClick={setPage.bind(null, page + 1)}
                  className="join-item disabled:opacity-50"
                >
                  »
                </Button>
              </div>
            </div>
          </Table.Cell>
        </Table.Row>
      ) : null,
    [columns.length, hasNextPage, hasPrevPage, page]
  );

  return (
    <section className="bg-base-200/50 no-scrollbar max-w-[95vw] overflow-scroll rounded-lg">
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
            <Table.Row className="grid min-h-[38px] place-items-center text-center">
              <Table.Cell colSpan={2}>
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
    </section>
  );
};

const TransactionRow: FC<{
  tx: RecentTransactionsOutput[number];
  contractMethod: ContractMethod;
}> = ({ tx }) => {
  return (
    <Table.Row>
      <Table.Cell className="from-base-300 via-base-300/70 to-base-300/25 sticky left-0 bg-gradient-to-r md:bg-none">
        {tx.event?.name}{" "}
        <span className="opacity-75">({tx.event?.symbol})</span>
      </Table.Cell>
      <Table.Cell>
        <Link
          href={`/recent-transactions/${tx.hash}`}
          className="group flex items-center gap-2"
        >
          <>
            {maskAddress(tx.hash as `0x${string}`)}
            <ExternalLinkIcon
              size="16"
              className="text-accent opacity-0 transition-opacity group-hover:opacity-100"
            />
          </>
        </Link>
      </Table.Cell>
      <Table.Cell>
        <Link href={`/block/${tx.blockHash}`}>
          {maskAddress(tx.blockHash as `0x${string}`)}
        </Link>
      </Table.Cell>
      <Table.Cell>{new Date(tx.timestamp * 1000).toLocaleString()}</Table.Cell>
    </Table.Row>
  );
};

export default RecentTransactionsTable;
