import { Tabs } from "@axelarjs/ui";
import React, { useState } from "react";

import { useAccount } from "wagmi";

import { CONTRACT_METHODS_LABELS } from "~/features/RecentTransactions";
import RecentTransactionsTable from "~/features/RecentTransactions/RecentTransactionsTable";
import {
  CONTRACT_METHODS,
  ContractMethod,
} from "~/features/RecentTransactions/types";
import Page from "~/ui/layouts/Page";

const RecentTransactionsPage = () => {
  const [contractMethod, setContractMethod] =
    useState<ContractMethod>("sendToken");

  const { address } = useAccount();

  return (
    <Page title="My Recent Interchain Transactions" className="space-y-4">
      <Page.Title>My Recent Transactions</Page.Title>
      <div className="space-y-2">
        <Tabs boxed>
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
        <RecentTransactionsTable
          contractMethod={contractMethod}
          senderAddress={address}
          maxTransactions={20}
        />
      </div>
    </Page>
  );
};

export default RecentTransactionsPage;
