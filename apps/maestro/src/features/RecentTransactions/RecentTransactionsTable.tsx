import { ExternalLinkIcon, Table } from "@axelarjs/ui";
import { maskAddress } from "@axelarjs/utils";
import { useState, type FC } from "react";
import Link from "next/link";

import { type Address } from "wagmi";

import { trpc } from "~/lib/trpc";
import type { RecentTransactionsOutput } from "~/server/routers/gmp/getRecentTransactions";
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
  const [page, setPage] = useState(1);

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
  const hasPrevPage = Number(prevPageTxns?.length) > 0;

  const hasPagination = hasNextPage || hasPrevPage;

  const columns = [
    {
      label: "Transaction",
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

  return (
    <section className="w-[80vw] space-y-4 md:w-auto">
      {title && <h2 className="text-2xl font-bold">{title}</h2>}
      <Table
        className="no-scrollbar bg-base-200/50 relative max-h-64 space-y-4 overflow-y-scroll md:max-h-96"
        zebra
      >
        <Table.Head>
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
              <TransactionItem
                key={`${tx.hash}-${i}`}
                tx={tx}
                contractMethod={contractMethod}
              />
            ))
          )}
          {hasPagination && (
            <Table.Row>
              <Table.Cell colSpan={columns.length}>
                <div className="flex items-center justify-center space-x-4">
                  {hasPrevPage && (
                    <button
                      disabled={!hasPrevPage}
                      onClick={() => setPage(page - 1)}
                      className="disabled:opacity-50"
                    >
                      &larr; Previous
                    </button>
                  )}
                  <span>
                    Page {page} of {page + 1}
                  </span>
                  {hasNextPage && (
                    <button
                      disabled={!hasNextPage}
                      onClick={() => setPage(page + 1)}
                      className="disabled:opacity-50"
                    >
                      Next &rarr;
                    </button>
                  )}
                </div>
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table>
    </section>
  );
};

const TransactionItem: FC<{
  tx: RecentTransactionsOutput[number];
  contractMethod: ContractMethod;
}> = ({ tx, contractMethod }) => {
  return (
    <Table.Row>
      <Table.Cell>
        Interchain {contractMethod == "sendToken" ? "transfer" : "deployment"}{" "}
        <span className="opacity-75">({contractMethod})</span>
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
