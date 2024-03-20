import { Alert, Dialog } from "@axelarjs/ui";
import { useCallback } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";

import { useAccount } from "wagmi";

import RecentTransactions from "~/features/RecentTransactions";
import SearchInterchainToken, {
  TokenFoundResult,
} from "~/features/SearchInterchainToken";
import { ConditionalRenderInterchainBanner } from "~/ui/components/InterchainBanner";
import { useLayoutStateContainer } from "~/ui/layouts/MainLayout";
import Page from "~/ui/layouts/Page";

const InterchainTokenDeployment = dynamic(
  () => import("~/features/InterchainTokenDeployment")
);

export default function HomePage() {
  const router = useRouter();
  const { chain } = useAccount();
  const [layoutState, layoutActions] = useLayoutStateContainer();

  const handleTokenFound = useCallback(
    async (result: TokenFoundResult) => {
      if (!chain) {
        return;
      }

      await router.push(
        `/${result.chainName?.toLowerCase() ?? ""}/${result?.tokenAddress}`
      );
    },
    [chain, router]
  );

  const handleDismissBanner = layoutActions.dismissDisclaimerBanner;

  const shouldRenderTestnetBanner =
    !layoutState.isSignInModalOpen && !layoutState.isBetaBannerDismissed;

  return (
    <>
      <Page
        pageTitle="Interchain Token Service"
        pageDescription="Interchain orchestration powered by Axelar"
        contentClassName="place-items-center"
        mustBeConnected
      >
        <div className="w-full">
          <ConditionalRenderInterchainBanner />
        </div>

        <div
          className="flex min-h-[80dvh] w-full max-w-lg flex-col items-center justify-center"
          id="main-content"
        >
          {shouldRenderTestnetBanner && (
            <Dialog open onClose={handleDismissBanner} className="bg-warning">
              <Dialog.Body className="bg-warning text-warning-content">
                <Dialog.CornerCloseAction onClick={handleDismissBanner} />
                <Alert $status="warning">
                  <span className="font-semibold">
                    You are using the Interchain Token Service Beta. The app is
                    in active development; further updates and improvements to
                    come!
                  </span>
                </Alert>
              </Dialog.Body>
            </Dialog>
          )}
          <div className="bg-base-100/70 grid w-full place-items-center rounded-2xl p-4">
            <SearchInterchainToken onTokenFound={handleTokenFound} />
            <div className="divider w-full">OR</div>
            <InterchainTokenDeployment />
          </div>
          <div className="mt-4">
            <section className="my-10 space-y-4">
              <div className="text-center text-xl font-bold">
                {Boolean(chain) && "MY "}RECENT{" "}
                <span className="hidden sm:inline-block">INTERCHAIN</span>{" "}
                TRANSACTIONS
              </div>
              <RecentTransactions maxTransactions={250} />
            </section>
          </div>
        </div>
      </Page>
    </>
  );
}
