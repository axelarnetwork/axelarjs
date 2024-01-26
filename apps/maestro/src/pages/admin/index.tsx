import { Suspense } from "react";

import { withRouteProtection } from "~/lib/auth";
import Page from "~/ui/layouts/Page";
import { AccountStatusesManager } from "./AccountStatuses";
import { GlobalMessageManager } from "./GlobalMessage";

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
