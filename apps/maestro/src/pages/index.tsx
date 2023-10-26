import { Alert, Dialog } from "@axelarjs/ui";
import { sluggify } from "@axelarjs/utils";
import { useCallback } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";

import { useNetwork } from "wagmi";

import { NEXT_PUBLIC_NETWORK_ENV } from "~/config/env";
import RecentTransactions from "~/features/RecentTransactions/RecentTransactions";
import SearchInterchainToken from "~/features/SearchInterchainToken";
import { useLayoutStateContainer } from "~/ui/layouts/MainLayout";
import Page from "~/ui/layouts/Page";

const AddErc20 = dynamic(() => import("~/features/AddErc20/AddErc20"));

export default function Home() {
  const router = useRouter();
  const { chain } = useNetwork();
  const [layoutState, layoutActions] = useLayoutStateContainer();

  const handleTokenFound = useCallback(
    async (result: { tokenAddress: string; tokenId?: string }) => {
      if (!chain) {
        return;
      }
      await router.push(`/${sluggify(chain.name)}/${result?.tokenAddress}`);
    },
    [chain, router]
  );

  const handleDismissBanner = layoutActions.dismissDisclaimerBanner;

  const shouldRenderTestnetBanner =
    NEXT_PUBLIC_NETWORK_ENV === "testnet" &&
    !layoutState.isSignInModalOpen &&
    !layoutState.isBetaBannerDismissed;

  return (
    <>
      <Page
        pageTitle="Axelar Interchain Token Service"
        pageDescription="Interchain orchestration powered by Axelar"
        className="place-items-center"
        mustBeConnected
      >
        <div
          className="flex min-h-[80dvh] w-full max-w-lg flex-col items-center justify-center"
          id="main-content"
        >
          {shouldRenderTestnetBanner && (
            <Dialog open onClose={handleDismissBanner} className="bg-warning">
              <Dialog.Body className="bg-warning text-warning-content">
                <Dialog.CornerCloseAction onClick={handleDismissBanner} />
                <Alert status="warning">
                  <span className="font-semibold">
                    You are using the Interchain Token Service Beta in testnet.
                    The app is in active development; further updates and
                    improvements to come!
                  </span>
                </Alert>
              </Dialog.Body>
            </Dialog>
          )}
          <div className="bg-base-100 grid w-full place-items-center rounded-2xl p-4">
            <SearchInterchainToken onTokenFound={handleTokenFound} />
            <div className="divider w-full">OR</div>
            <AddErc20 />
          </div>
          <div className="mt-4">
            <section className="my-10 space-y-4">
              <div className="text-center text-xl font-bold">
                RECENT INTERCHAIN TRANSACTIONS
              </div>
              <RecentTransactions />
            </section>
          </div>
        </div>
      </Page>
    </>
  );
}
