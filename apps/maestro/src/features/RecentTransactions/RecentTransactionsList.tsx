import { Card } from "@axelarjs/ui";
import { maskAddress } from "@axelarjs/utils";
import { useEffect, useState, type FC } from "react";
import Link from "next/link";

import { formatDuration, intervalToDuration } from "date-fns";
import { type Address } from "wagmi";

import { NEXT_PUBLIC_EXPLORER_URL } from "~/config/env";
import { trpc } from "~/lib/trpc";
import type { RecentTransactionsOutput } from "~/server/routers/gmp/getRecentTransactions";
import { type ContractMethod } from "./types";

function useHumanizedElapsedTime(timestamp: number) {
  const [now, setNow] = useState(Date.now());
  const interval = intervalToDuration({
    start: timestamp * 1000,
    end: now,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const formatted = formatDuration(interval);

  const sanitized = interval.days
    ? formatted
        .replace(/\sdays?/, "d")
        .replace(/\shours?/, "h")
        .replace(/\sminutes?/, "m")
        .replace(/\sseconds?/, "s")
    : formatted;

  return `${sanitized} ago`;
}

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
    <Card className="bg-base-300 p-2">
      <Card.Body>
        {title && (
          <Card.Title>
            <h3>{title}</h3>
          </Card.Title>
        )}
        <div className="w-[80vw] space-y-4 md:w-auto">
          <ul className="no-scrollbar relative max-h-64 min-w-[256px] space-y-4 overflow-y-scroll md:max-h-96">
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
                <TransactionItem
                  key={i}
                  tx={tx}
                  contractMethod={contractMethod}
                />
              ))
            )}
            <li className="to-base-300/90 sticky bottom-0 h-16 w-full bg-gradient-to-b from-transparent md:h-20"></li>
          </ul>
        </div>
      </Card.Body>
    </Card>
  );
};

const TransactionItem: FC<{
  tx: RecentTransactionsOutput[number];
  contractMethod: ContractMethod;
}> = ({ tx, contractMethod }) => {
  const humanizedElapsedTime = useHumanizedElapsedTime(tx.timestamp);

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
            className="inline-block text-sm font-semibold"
            href={`${NEXT_PUBLIC_EXPLORER_URL}/gmp/${tx.hash}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {maskAddress(tx.hash as `0x${string}`, {
              segmentA: 12,
              segmentB: 52,
            })}
          </Link>
        </div>
        <div className="p-1 pb-2 text-sm">
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
        <div className="font-mono text-xs">{humanizedElapsedTime}</div>
      </div>
    </li>
  );
};

export default RecentTransactionsList;
