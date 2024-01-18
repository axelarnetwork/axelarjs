import { Suspense } from "react";
import { useSession } from "next-auth/react";

import Page from "~/ui/layouts/Page";
import TokenList from "./TokenList";

const InterchainTokensPage = () => {
  const { data: session } = useSession();

  return (
    <Page pageTitle="My Interchain Tokens">
      <div className="flex flex-col gap-4">
        <Suspense
          fallback={
            <Page.FullScreenLoading loadingMessage="loading interchain tokens..." />
          }
        >
          <TokenList sessionAddress={session?.address} />
        </Suspense>
      </div>
    </Page>
  );
};

export default InterchainTokensPage;
