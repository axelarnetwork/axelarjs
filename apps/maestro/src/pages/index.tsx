import { Alert, Button, Dialog } from "@axelarjs/ui";
import { sluggify } from "@axelarjs/utils";
import { useLocalStorageState } from "@axelarjs/utils/react";
import { useCallback } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";

import { useNetwork } from "wagmi";

import { NEXT_PUBLIC_NETWORK_ENV } from "~/config/env";
import SearchInterchainToken from "~/features/SearchInterchainToken";
import Page from "~/layouts/Page";

const AddErc20 = dynamic(() => import("~/features/AddErc20/AddErc20"));

export default function Home() {
  const router = useRouter();
  const { chain } = useNetwork();
  const [persistedState, setPersistedState] = useLocalStorageState(
    "@axelar/maestro/showBetaBanner",
    {
      showBetaBanner: true,
    }
  );

  const handleTokenFound = useCallback(
    (result: { tokenAddress: string; tokenId?: string }) => {
      if (!chain) {
        return;
      }
      router.push(`/${sluggify(chain.name)}/${result?.tokenAddress}`);
    },
    [chain, router]
  );

  const handleDismissBanner = useCallback(() => {
    setPersistedState({ showBetaBanner: false });
  }, [setPersistedState]);

  return (
    <>
      <div
        className="hero min-h-[100dvh]"
        style={{
          backgroundImage: "url(/ilustrations/hero.webp)",
        }}
      >
        <div className="hero-overlay bg-opacity-60"></div>
        <div className="hero-content text-neutral-content translate-y-48 text-center md:-translate-y-56">
          <div className="max-w-lg">
            <h1 className="mb-5 text-3xl font-bold md:text-5xl">
              Interchain Token Service
            </h1>
            <p className="mb-5 text-sm md:text-base">
              Interchain token service is a decentralized service that allows
              you to transfer your tokens between blockchains.
            </p>
            <Button
              variant="primary"
              onClick={() => {
                // Scroll to main content
                window.scrollTo(
                  0,
                  document.getElementById("main-content")?.offsetTop ?? 0
                );
              }}
            >
              Take your token Interchain!
            </Button>
          </div>
        </div>
      </div>
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
            persistedState.showBetaBanner && (
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
