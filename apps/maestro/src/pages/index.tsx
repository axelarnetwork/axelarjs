import { Alert, Dialog } from "@axelarjs/ui";
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
    <Page
      pageTitle="Axelar Interchain Token Service"
      pageDescription="Interchain orchestration powered by Axelar"
      className="place-items-center"
      mustBeConnected
    >
      <div className="flex w-full max-w-lg flex-col items-center justify-center">
        {NEXT_PUBLIC_NETWORK_ENV === "testnet" &&
          persistedState.showBetaBanner && (
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
        <SearchInterchainToken onTokenFound={handleTokenFound} />
        <div className="divider">OR</div>
        <AddErc20 />
      </div>
    </Page>
  );
}
