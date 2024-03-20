import { Tabs } from "@axelarjs/ui";
import { invert } from "@axelarjs/utils";
import { Suspense } from "react";

import { useAccount } from "wagmi";

import { CONTRACT_METHODS_LABELS } from "~/features/RecentTransactions";
import RecentTransactionsTable from "~/features/RecentTransactions/RecentTransactionsTable";
import {
  CONTRACT_METHODS,
  ContractMethod,
} from "~/features/RecentTransactions/types";
import useQueryStringState from "~/lib/hooks/useQueryStringStyate";
import Page from "~/ui/layouts/Page";

export const TAB_MAP = {
  interchainTransfer: "InterchainTransfer",
  tokenDeployment: "InterchainTokenDeploymentStarted",
} as const;

export const REVERSE_TAB_MAP = invert(TAB_MAP);

const RecentTransactionsPage = () => {
  const [tab, setTab] = useQueryStringState<keyof typeof TAB_MAP>(
    "tab",
    "interchainTransfer",
  );

  const { address } = useAccount();

  const contractMethod = TAB_MAP[tab] as ContractMethod;

  return (
    <Page
      title={`${address ? "My" : ""} Recent Interchain Transactions `}
      contentClassName="flex flex-col space-y-4"
    >
      <Page.Title>
        {`${address ? "My" : ""} Recent Interchain Transactions`}
      </Page.Title>
      <div className="flex-1 space-y-4">
        <Suspense
          fallback={
            <Page.FullScreenLoading loadingMessage="loading recent transactions..." />
          }
        >
          <Tabs $boxed>
            {CONTRACT_METHODS.map((method) => (
              <Tabs.Tab
                key={method}
                onClick={(e) => {
                  e.preventDefault();
                  setTab(REVERSE_TAB_MAP[method]);
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
        </Suspense>
      </div>
    </Page>
  );
};

export default RecentTransactionsPage;
