import { type FC } from "react";
import Link from "next/link";

import { formatDuration, intervalToDuration } from "date-fns";
import { type Address } from "wagmi";

import { NEXT_PUBLIC_EXPLORER_URL } from "~/config/env";
import { trpc } from "~/lib/trpc";
import type { RecentTransactionsOutput } from "~/server/routers/gmp/getRecentTransactions";
import { type ContractMethod } from "./types";

const getHumanizedElapsedTime = (timestamp: number) => {
  const interval = intervalToDuration({
    start: timestamp * 1000,
    end: Date.now(),
  });

  return `${formatDuration(interval)} ago`;
};

type Props = {
  contractMethod: ContractMethod;
  senderAddress?: Address;
  title?: string;
};

export const RecentTransactionsList: FC<Props> = ({
  contractMethod,
  senderAddress,
  title,
}) => {
  const { data: txns, isLoading } = trpc.gmp.getRecentTransactions.useQuery({
    contractMethod,
    senderAddress,
  });

  return (
    <div className="space-y-4">
      {title && <h3 className="text-center text-lg font-semibold">{title}</h3>}
      <ul className="no-scrollbar relative max-h-64 space-y-2 overflow-y-scroll md:max-h-96">
        {isLoading ? (
          <li className="grid min-h-[384px] place-items-center text-center">
            Loading transactions...
          </li>
        ) : !txns?.length ? (
          <li className="grid min-h-[384px] place-items-center text-center">
            No transactions found
          </li>
        ) : (
          txns.map((tx, i) => (
            <TransactionItem key={i} tx={tx} contractMethod={contractMethod} />
          ))
        )}
        <li className="to-base-200/90 sticky bottom-0 h-16 w-full bg-gradient-to-b from-transparent md:h-20"></li>
      </ul>
    </div>
  );
};

const TransactionItem: FC<{
  tx: RecentTransactionsOutput[number];
  contractMethod: ContractMethod;
}> = ({ tx, contractMethod }) => {
  return (
    <li className="flex items-center gap-2">
      <div className="avatar placeholder">
        <div className="bg-neutral-focus text-neutral-content w-12 rounded-full">
          <span className="text-xl">
            {contractMethod === "sendToken" ? "ST" : "TD"}
          </span>
        </div>
      </div>
      <div>
        <div>
          <Link
            className="inline-block max-w-[120px] overflow-hidden text-ellipsis text-sm font-semibold"
            href={`${NEXT_PUBLIC_EXPLORER_URL}/gmp/${tx.hash}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {tx.hash}
          </Link>
        </div>
        <div className="text-sm">
          {tx.event?.event === "TokenSent" && (
            <div>
              {tx.event.name}{" "}
              <span className="opacity-70">({tx.event.symbol})</span>
            </div>
          )}
          {tx.event?.event === "StandardizedTokenDeployed" && (
            <div>
              {tx.event.name}{" "}
              <span className="opacity-70">({tx.event.symbol})</span>
            </div>
          )}
        </div>
        <div className="text-xs">{getHumanizedElapsedTime(tx.timestamp)}</div>
      </div>
    </li>
  );
};

export default RecentTransactionsList;
