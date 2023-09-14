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
};

export const RecentTransactions: FC<Props> = ({
  contractMethod,
  senderAddress,
}) => {
  const { data: txns, isLoading } = trpc.gmp.getRecentTransactions.useQuery({
    contractMethod,
    senderAddress,
  });

  return (
    <ul className="max-h-96 space-y-2 overflow-y-scroll">
      {isLoading ? (
        <li className="grid min-h-[384px] place-items-center text-center">
          Loading transactions...
        </li>
      ) : !txns?.length ? (
        <li className="grid min-h-[384px] place-items-center text-center">
          No transactions found
        </li>
      ) : (
        txns.map((tx) => (
          <li
            key={tx.hash.concat(contractMethod)}
            className="flex items-center gap-2"
          >
            <div className="avatar placeholder">
              <div className="bg-neutral-focus text-neutral-content w-12 rounded-full">
                <span className="text-xl">TX</span>
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
    </ul>
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
  const ctx = trpc.useContext();

  const { address } = useAccount();

  return (
    <section className="space-y-4">
      <Card className="bg-base-200 w-full">
        <Card.Body>
          <Card.Title>
            <div>
              <h2 className="text-lg font-semibold">Recent Transactions</h2>
            </div>
            <Tabs boxed>
              {CONTRACT_METHODS.map((method) => (
                <Tabs.Tab
                  key={method}
                  onClick={(e) => {
                    e.preventDefault();
                    ctx.gmp.getRecentTransactions.invalidate().then(() => {
                      setContractMethod(method);
                    });
                  }}
                  active={contractMethod === method}
                >
                  {CONTRACT_METHODS_LABELS[method]}
                </Tabs.Tab>
              ))}
            </Tabs>
          </Card.Title>
          <RecentTransactions
            contractMethod="StandardizedTokenDeployed"
            senderAddress={address}
          />
        </Card.Body>
      </Card>
    </section>
  );
};

export default RecentTransactionsTabs;
