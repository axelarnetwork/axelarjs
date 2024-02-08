import { Suspense } from "react";

import { AccountStatusesManager } from "~/features/AdminPanel/AccountStatuses";
import { CanonicalTokenRecovery } from "~/features/AdminPanel/CanonicalTokenRecovery";
import { GlobalMessageManager } from "~/features/AdminPanel/GlobalMessage";
import { withRouteProtection } from "~/lib/auth";
import Page from "~/ui/layouts/Page";

const AdminIndexPage = () => {
  return (
    <Page
      title="Admin"
      contentClassName="flex flex-1 flex-col gap-4"
      mustBeConnected
    >
      <Suspense fallback={<Page.FullScreenLoading />}>
        <Page.Title>Admin Panel</Page.Title>
        <Page.Content className="gap-4">
          <GlobalMessageManager />
          <AccountStatusesManager />
          <CanonicalTokenRecovery />
        </Page.Content>
      </Suspense>
    </Page>
  );
};

export default withRouteProtection(AdminIndexPage, {
  redirectTo: "/",
  accountStatuses: ["privileged"],
});
