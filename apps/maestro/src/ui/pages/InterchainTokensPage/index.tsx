import { Suspense } from "react";
import { useSession } from "next-auth/react";

import { trpc } from "~/lib/trpc";
import Page from "~/ui/layouts/Page";
import TokenList from "./TokenList";

const useGetMyInterchainTokensQuery =
  trpc.interchainToken.getMyInterchainTokens.useQuery;

const InterchainTokensPage = () => {
  const { data: session } = useSession();

  const { data } = useGetMyInterchainTokensQuery(
    {
      sessionAddress: session?.address as `0x${string}`,
    },
    {
      suspense: true,
      enabled: Boolean(session?.address),
    }
  );

  return (
    <Page pageTitle="My Interchain Tokens">
      <div className="flex flex-col gap-4">
        <Page.Title className="flex items-center gap-2">
          My Interchain Tokens
          {Boolean(data?.length) && (
            <span className="text-base-content-secondary font-mono text-base">
              ({data?.length})
            </span>
          )}
        </Page.Title>
        <Suspense fallback={<div>Loading...</div>}>
          <TokenList sessionAddress={session?.address} />
        </Suspense>
      </div>
    </Page>
  );
};

export default InterchainTokensPage;
