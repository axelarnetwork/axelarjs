import { createContainer, useLocalStorageState } from "@axelarjs/utils/react";
import { useEffect, useState, type FC } from "react";

import { NEXT_PUBLIC_NETWORK_ENV } from "~/config/env";
import { useWeb3SignIn } from "~/lib/hooks/useWeb3SignIn";

const DEFAULT_BANNERS_STATE = {
  isTestnetBannerDismissed: false,
  isHeroBannerDismissed: false,
  isBetaBannerDismissed: false,
};

function useLayoutState() {
  const [DrawerSideContent, setDrawerSideContent] = useState<FC>(
    () => () => null
  );
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [persistedState, setPersistedState] = useLocalStorageState(
    "@axelar/maestro/banners",
    DEFAULT_BANNERS_STATE
  );

  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [signInError, setSignInError] = useState<Error>();
  const [signInAddress, setSignInAddress] = useState<`0x${string}` | null>(
    null
  );

  useEffect(() => {
    let timeoutId = -1;

    if (isSignedIn) {
      timeoutId = window.setTimeout(
        setIsSignInModalOpen.bind(null, false),
        1500
      );
    }
    return () => window.clearTimeout(timeoutId);
  }, [isSignedIn]);

  const { signInAsync: retrySignInAsync } = useWeb3SignIn({
    onSignInStart(address) {
      setIsSignInModalOpen(true);
      setSignInAddress(address);
    },
    onSignInSuccess() {
      if (NEXT_PUBLIC_NETWORK_ENV !== "mainnet") {
        console.log("session initiated");
      }
      setIsSignedIn(true);
    },
    onSignInError: setSignInError,
  });

  /**
   * Set the component to render in the drawer
   *
   * @param value component to be rendered
   */
  const _setDrawerSideContent = (value: FC) =>
    // callback is needed for react to store a function component as state
    setDrawerSideContent(() => value);

  return [
    {
      DrawerSideContent,
      isDrawerOpen,
      isSignInModalOpen,
      isSignedIn,
      signInError,
      signInAddress,
      retrySignInAsync: () => {
        retrySignInAsync(signInAddress);
        setSignInError(undefined);
      },
      ...persistedState,
    },
    {
      setDrawerSideContent: _setDrawerSideContent,
      openDrawer: () => setDrawerOpen(true),
      closeDrawer: () => setDrawerOpen(false),
      toggleDrawer: () => setDrawerOpen((isOpen) => !isOpen),
      openDrawerWithContent: (value: FC) => {
        _setDrawerSideContent(value);
        setDrawerOpen(true);
      },
      dismissTestnetBanner: () => {
        setPersistedState((stateDraft) => {
          stateDraft.isTestnetBannerDismissed = true;
        });
      },
      dismissHeroBanner: () => {
        setPersistedState((stateDraft) => {
          stateDraft.isHeroBannerDismissed = true;
        });
      },
      dismissDisclaimerBanner: () => {
        setPersistedState((stateDraft) => {
          stateDraft.isBetaBannerDismissed = true;
        });
      },
    },
  ] as const;
}

export const {
  Provider: LayoutStateProvider,
  useContainer: useLayoutStateContainer,
} = createContainer(useLayoutState);
