import { Alert, Button, Dialog } from "@axelarjs/ui";
import { sluggify } from "@axelarjs/utils";
import { useCallback } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";

import { ChevronDownIcon } from "lucide-react";
import { useNetwork } from "wagmi";

import { APP_NAME } from "~/config/app";
import { NEXT_PUBLIC_NETWORK_ENV } from "~/config/env";
import SearchInterchainToken from "~/features/SearchInterchainToken";
import { useLayoutStateContainer } from "~/layouts/MainLayout.state";
import Page from "~/layouts/Page";

const AddErc20 = dynamic(() => import("~/features/AddErc20/AddErc20"));

export default function Home() {
  const router = useRouter();
  const { chain } = useNetwork();
  const [layoutState, layoutActions] = useLayoutStateContainer();

  const handleTokenFound = useCallback(
    (result: { tokenAddress: string; tokenId?: string }) => {
      if (!chain) {
        return;
      }
      router.push(`/${sluggify(chain.name)}/${result?.tokenAddress}`);
    },
    [chain, router]
  );

  const handleDismissBanner = layoutActions.dismissDisclaimerBanner;

  return (
    <>
      {!layoutState.isHeroBannerDismissed && (
        <section
          className="hero animate-fade-in min-h-[100dvh] origin-center [animation-duration:1.5s]"
          style={{
            backgroundImage: "url(/ilustrations/hero3.webp)",
          }}
        >
          <div className="hero-overlay bg-opacity-50" />
          <div className="hero-content text-neutral-content translate-y-[30dvh] text-center md:-translate-y-[15dvh]">
            <div className="max-w-lg">
              <h1 className="mb-5 text-3xl font-black text-white/75 drop-shadow-lg md:text-5xl">
                {APP_NAME}
              </h1>
              <p className="mb-5 px-4 text-base text-white/60 drop-shadow-lg md:text-lg">
                Take your tokens Interchain with the {APP_NAME}
              </p>
              <Button
                variant="ghost"
                shape="circle"
                size="lg"
                className="bg-accent/25 animate-pulse"
                onClick={() => {
                  // Scroll to main content
                  window.scrollTo(
                    0,
                    document.getElementById("main-content")?.offsetTop ?? 0
                  );
                }}
              >
                <ChevronDownIcon size="2.5rem" className="text-black/75" />
              </Button>
            </div>
          </div>
        </section>
      )}
      <Page
        pageTitle="Axelar Interchain Token Service"
        pageDescription="Interchain orchestration powered by Axelar"
        className="place-items-center"
        mustBeConnected
      >
        <div
          className="flex min-h-[100dvh] w-full max-w-lg flex-col items-center justify-center"
          id="main-content"
        >
          {NEXT_PUBLIC_NETWORK_ENV === "testnet" &&
            !layoutState.isBetaBannerDismissed && (
              <Dialog open onClose={handleDismissBanner} className="bg-warning">
                <Dialog.Body className="bg-warning text-warning-content">
                  <Dialog.CornerCloseAction onClick={handleDismissBanner} />
                  <Alert status="warning">
                    <span className="font-semibold">
                      You are using the Interchain Token Service Beta in
                      testnet. The app is in active development; further updates
                      and improvements to come!
                    </span>
                  </Alert>
                </Dialog.Body>
              </Dialog>
            )}
          <SearchInterchainToken onTokenFound={handleTokenFound} />
          <div className="divider">OR</div>
          <AddErc20 />
        </div>
      </Page>
    </>
  );
}
