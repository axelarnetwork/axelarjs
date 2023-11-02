import { Card, Tabs } from "@axelarjs/ui";
import { FC, useState } from "react";

import { useAccount } from "wagmi";

import RecentTransactionsList from "./RecentTransactionsList";
import { CONTRACT_METHODS, type ContractMethod } from "./types";

export const CONTRACT_METHODS_LABELS: Partial<Record<ContractMethod, string>> =
  {
    sendToken: "Send Token",
    StandardizedTokenDeployed: "Token Deployed",
  };

type Props = {
  maxTransactions?: number;
};

const RecentTransactionsTabs: FC<Props> = ({ maxTransactions = 10 }) => {
  const [contractMethod, setContractMethod] =
    useState<ContractMethod>("sendToken");

  const { address } = useAccount();

  return (
    <div>
      <Card className="bg-base-200 w-full rounded-3xl" compact>
        <Card.Body>
          <Card.Title className="grid place-items-center space-y-2 text-center md:hidden">
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
          <div className="hidden w-[90vw] min-w-max max-w-4xl grid-cols-2 gap-4 md:grid">
            <RecentTransactionsList
              contractMethod="sendToken"
              senderAddress={address}
              title="Transfers"
              maxTransactions={maxTransactions}
            />
            <RecentTransactionsList
              contractMethod="StandardizedTokenDeployed"
              senderAddress={address}
              title="Token Deployments"
              maxTransactions={maxTransactions}
            />
          </div>
          <div className="md:hidden">
            <RecentTransactionsList
              contractMethod={contractMethod}
              senderAddress={address}
            />
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default RecentTransactionsTabs;
