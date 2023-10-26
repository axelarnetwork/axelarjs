import React from "react";

import RecentTransactionsTabs from "~/features/RecentTransactions/RecentTransactions";
import Page from "~/ui/layouts/Page";

const RecentTransactionsPage = () => {
  return (
    <Page title="My Recent Interchain Transactions">
      <Page.Title>My Recent Transactions</Page.Title>
      <RecentTransactionsTabs maxTransactions={50} />
    </Page>
  );
};

export default RecentTransactionsPage;
