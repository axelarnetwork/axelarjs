import { withRouteProtection } from "~/lib/auth";
import Page from "~/ui/layouts/Page";

const AdminIndexPage = () => {
  return <Page>admin</Page>;
};

export default withRouteProtection(AdminIndexPage, {
  redirectTo: "/",
  accountStatuses: ["privileged"],
});
