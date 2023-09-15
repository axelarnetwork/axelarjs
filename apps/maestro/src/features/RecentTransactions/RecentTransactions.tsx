import { Card, Tabs } from "@axelarjs/ui";
import { useState } from "react";

import { useAccount } from "wagmi";

import RecentTransactionsList from "./RecentTransactionsList";
import { CONTRACT_METHODS, type ContractMethod } from "./types";

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
            <RecentTransactionsList
              contractMethod="sendToken"
              senderAddress={address}
              title="Recent Interchain Transfers"
            />
            <RecentTransactionsList
              contractMethod="StandardizedTokenDeployed"
              senderAddress={address}
              title="Recent Token Deployments"
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
    </section>
  );
};

export default RecentTransactionsTabs;
