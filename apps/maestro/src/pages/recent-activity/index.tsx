import { Suspense } from "react";

import RecentTransactionsTable from "~/features/RecentTransactions/RecentTransactionsTable";
import Page from "~/ui/layouts/Page";

const RecentActivityPage = () => {
  return (
    <Page
      title={`Recent Deployment Activity `}
      contentClassName="flex flex-col space-y-4"
    >
      <Page.Title>{` Recent Deployment Activity`}</Page.Title>
      <div className="flex-1 space-y-4">
        <Suspense
          fallback={
            <Page.FullScreenLoading loadingMessage="loading recent activity..." />
          }
        >
          <RecentTransactionsTable isTokensTable />
        </Suspense>
      </div>
    </Page>
  );
};

export default RecentActivityPage;
