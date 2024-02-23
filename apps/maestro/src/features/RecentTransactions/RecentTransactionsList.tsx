import { Card, ExternalLinkIcon, Tooltip } from "@axelarjs/ui";
import { maskAddress } from "@axelarjs/utils";
import { useEffect, useState, type FC } from "react";
import Link from "next/link";

import { formatDuration, intervalToDuration } from "date-fns";
import type { Address } from "viem";

import {
  NEXT_PUBLIC_EXPLORER_URL,
  NEXT_PUBLIC_INTERCHAIN_TOKEN_SERVICE_ADDRESS,
} from "~/config/env";
import { trpc } from "~/lib/trpc";
import type { RecentTransactionsOutput } from "~/server/routers/gmp/getRecentTransactions";
import { TokenIcon } from "~/ui/pages/InterchainTokenDetailsPage/TokenDetailsSection";
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
  maxTransactions?: number;
};

export const RecentTransactionsList: FC<Props> = ({
  contractMethod,
  senderAddress,
  title,
  maxTransactions = 10,
}) => {
  const { data: txns, isLoading } = trpc.gmp.getRecentTransactions.useQuery({
    contractMethod,
    senderAddress,
    pageSize: maxTransactions,
  });

  return (
    <Card className="bg-base-100 overflow-hidden rounded-xl">
      <Card.Body className="to-base-200/90 dark:to-base-300/90 bg-base-100 bg-gradient-to-b from-transparent">
        {title && (
          <Card.Title className="grid place-items-center">
            <Link
              className="hover:text-accent group flex items-center gap-1 hover:underline"
              href={`${NEXT_PUBLIC_EXPLORER_URL}/gmp/search?contractAddress=${NEXT_PUBLIC_INTERCHAIN_TOKEN_SERVICE_ADDRESS}&contractMethod=${contractMethod}${
                senderAddress ? `&senderAddress=${senderAddress}` : ``
              }`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Tooltip
                position={"bottom"}
                tip={`See all ${senderAddress ? `my` : ``} ${
                  contractMethod === "InterchainTransfer"
                    ? `transfers`
                    : `token deployments`
                } on Axelarscan`}
              >
                {title}{" "}
              </Tooltip>
            </Link>
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
            <li className="to-base-200/90 dark:to-base-300/90 sticky bottom-0 h-16 w-full bg-gradient-to-b from-transparent md:h-20" />
          </ul>
        </div>
      </Card.Body>
    </Card>
  );
};

const TransactionItem: FC<{
  tx: RecentTransactionsOutput[number];
  contractMethod: ContractMethod;
}> = ({ tx }) => {
  const humanizedElapsedTime = useHumanizedElapsedTime(tx.timestamp);

  return (
    <li className="flex items-center gap-2 pl-2">
      {(tx.event?.event === "InterchainTransfer" ||
        tx.event?.event === "InterchainTokenDeploymentStarted") && (
        <TokenIcon tokenId={tx.event.tokenId} />
      )}
      <div>
        <div>
          <Tooltip tip="View on AxelarScan" position="bottom">
            <Link
              className="group inline-flex items-center text-sm font-semibold hover:underline"
              href={`${NEXT_PUBLIC_EXPLORER_URL}/gmp/${tx.hash}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {maskAddress(tx.hash, {
                segmentA: 12,
                segmentB: 52,
              })}{" "}
              <ExternalLinkIcon className="text-accent h-3 opacity-0 transition-opacity group-hover:opacity-100" />
            </Link>
          </Tooltip>
        </div>
        <div className="p-1 pb-2 text-sm">
          {tx.event && (
            <Link
              className="hover:text-primary hover:cursor-pointer"
              href={`/interchain-tokens/${tx.event.tokenId}`}
            >
              {tx.event.event === "InterchainTransfer"
                ? tx.event.name
                : tx.event.tokenName}{" "}
              <span className="text-neutral opacity-50 dark:text-white">
                (
                {tx.event.event === "InterchainTransfer"
                  ? tx.event.symbol
                  : tx.event.tokenSymbol}
                )
              </span>
            </Link>
          )}
        </div>
        <div className="font-mono text-xs">{humanizedElapsedTime}</div>
      </div>
    </li>
  );
};

export default RecentTransactionsList;
