import type { ContractMethod } from "@axelarjs/api";
import { Card, Tabs } from "@axelarjs/ui";
import { useState, type FC } from "react";
import Link from "next/link";

import { formatDuration, intervalToDuration } from "date-fns";
import { useAccount, type Address } from "wagmi";

import { NEXT_PUBLIC_EXPLORER_URL } from "~/config/env";
import { trpc } from "~/lib/trpc";

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

export const RecentTransactions: FC<Props> = ({
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
            <li
              key={`${tx.hash}-${contractMethod}-${tx.timestamp}-${i}`}
              className="flex items-center gap-2"
            >
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
                    className="inline-block max-w-[120px] overflow-hidden text-ellipsis font-semibold"
                    href={`${NEXT_PUBLIC_EXPLORER_URL}/gmp/${tx.hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {tx.hash}
                  </Link>
                </div>
                <div>{getHumanizedElapsedTime(tx.timestamp)}</div>
              </div>
            </li>
          ))
        )}
        <li className="to-base-200/90 sticky bottom-0 h-16 w-full bg-gradient-to-b from-transparent md:h-20"></li>
      </ul>
    </div>
  );
};

const CONTRACT_METHODS: ContractMethod[] = [
  "sendToken",
  "StandardizedTokenDeployed",
];

const CONTRACT_METHODS_LABELS: Partial<Record<ContractMethod, string>> = {
  sendToken: "Send Token",
  StandardizedTokenDeployed: "Token Deployed",
};

const RecentTransactionsTabs = () => {
  const [contractMethod, setContractMethod] =
    useState<ContractMethod>("sendToken");

  const { address } = useAccount();

  return (
    <section className="space-y-4">
      <Card className="bg-base-200 card-compact md:card-normal w-full">
        <Card.Body>
          <Card.Title className="grid place-items-center space-y-2 text-center md:hidden">
            <div>
              <h2 className="text-lg font-semibold">Recent Transactions</h2>
            </div>
            <Tabs boxed className="md:hidden">
              {CONTRACT_METHODS.map((method) => (
                <Tabs.Tab
                  key={method}
                  onClick={(e) => {
                    e.preventDefault();
                    setContractMethod(method);
                  }}
                  active={contractMethod === method}
                >
                  {CONTRACT_METHODS_LABELS[method]}
                </Tabs.Tab>
              ))}
            </Tabs>
          </Card.Title>
          <div className="hidden min-w-max grid-cols-2 md:grid">
            <RecentTransactions
              contractMethod="sendToken"
              senderAddress={address}
              title="Recent Interchain Transfers"
            />
            <RecentTransactions
              contractMethod="StandardizedTokenDeployed"
              senderAddress={address}
              title="Recent Token Deployments"
            />
          </div>
          <div className="md:hidden">
            <RecentTransactions
              contractMethod={contractMethod}
              senderAddress={address}
            />
          </div>
        </Card.Body>
      </Card>
    </section>
  );
};

export default RecentTransactionsTabs;
