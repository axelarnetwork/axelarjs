import { Button, ChevronDownIcon, ExternalLinkIcon, Table } from "@axelarjs/ui";
import { maskAddress } from "@axelarjs/utils";
import { useEffect, useMemo, useState, type FC } from "react";
import Link from "next/link";

import { type Address } from "wagmi";

import { trpc } from "~/lib/trpc";
import type { RecentTransactionsOutput } from "~/server/routers/gmp/getRecentTransactions";
import { CONTRACT_METHODS_LABELS } from ".";
import { type ContractMethod } from "./types";

type Props = {
  contractMethod: ContractMethod;
  senderAddress?: Address;
  title?: string;
  maxTransactions?: number;
};

export const RecentTransactionsTable: FC<Props> = ({
  contractMethod,
  senderAddress,
  title,
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
            <div className="flex items-center justify-center space-x-4">
              {hasPrevPage && (
                <Button
                  aria-label="previous page"
                  size="sm"
                  disabled={!hasPrevPage}
                  onClick={() => setPage(page - 1)}
                  className="disabled:opacity-50"
                >
                  <ChevronDownIcon size={18} className="rotate-90" />
                </Button>
              )}
              <span>Page {page + 1}</span>
              {hasNextPage && (
                <Button
                  aria-label="next page"
                  size="sm"
                  disabled={!hasNextPage}
                  onClick={() => setPage(page + 1)}
                  className="disabled:opacity-50"
                >
                  <ChevronDownIcon size={18} className="-rotate-90" />
                </Button>
              )}
            </div>
          </Table.Cell>
        </Table.Row>
      ) : null,
    [columns.length, hasNextPage, hasPrevPage, page]
  );

  return (
    <section className="w-[80vw] space-y-4 md:w-auto">
      {title && <h2 className="text-2xl font-bold">{title}</h2>}
      <Table
        className="no-scrollbar bg-base-200/50 relative max-h-64 space-y-4 overflow-y-scroll md:max-h-96"
        zebra
      >
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
              <Table.Column key={column.label}>{column.label}</Table.Column>
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
      <Table.Cell>
        {tx.event?.name}{" "}
        <span className="opacity-75">({tx.event?.symbol})</span>
      </Table.Cell>
      <Table.Cell>
        <Link href={`/tx/${tx.hash}`} className="group flex items-center gap-2">
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
      <Table.Cell>{new Date(tx.timestamp).toLocaleString()}</Table.Cell>
    </Table.Row>
  );
};

export default RecentTransactionsTable;
