import { Suspense } from "react";

import { AccountStatusesManager } from "~/features/AdminPanel/AccountStatuses";
import { GlobalMessageManager } from "~/features/AdminPanel/GlobalMessage";
import { withRouteProtection } from "~/lib/auth";
import Page from "~/ui/layouts/Page";

const AdminIndexPage = () => {
  return (
    <Page title="Admin" className="flex flex-1 flex-col gap-4" mustBeConnected>
      <Suspense fallback={<Page.FullScreenLoading />}>
        <Page.Title>Admin Panel</Page.Title>
        <Page.Content className="gap-4">
          <GlobalMessageManager />
          <AccountStatusesManager />
        </Page.Content>
      </Suspense>
    </Page>
  );
};

export default withRouteProtection(AdminIndexPage, {
  redirectTo: "/",
  accountStatuses: ["privileged"],
});
