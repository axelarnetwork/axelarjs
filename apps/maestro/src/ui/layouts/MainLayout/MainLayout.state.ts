import { createContainer, useLocalStorageState } from "@axelarjs/utils/react";
import { useEffect, useState, type FC } from "react";

import { NEXT_PUBLIC_NETWORK_ENV } from "~/config/env";
import { useAuth } from "~/contexts/AuthContext";

const DEFAULT_BANNERS_STATE = {
  isTestnetBannerDismissed: false,
  isHeroBannerDismissed: false,
  isBetaBannerDismissed: false,
  isGlobalBannerDismissed: false,
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

  const {
    retryAsync: retrySignInAsync,
    error: signInError,
    isSuccess: isSignedIn,
  } = useAuth();

  useEffect(() => {
    let timeoutId = -1;

    if (isSignedIn) {
      timeoutId = window.setTimeout(
        setIsSignInModalOpen.bind(null, false),
        3000
      );

      if (NEXT_PUBLIC_NETWORK_ENV !== "mainnet") {
        console.log("session initiated");
      }
    }
    return () => window.clearTimeout(timeoutId);
  }, [isSignedIn]);

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
      retrySignInAsync,
      abortSignIn: () => {
        setIsSignInModalOpen(false);
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
      dismissGlobalBanner: () => {
        setPersistedState((stateDraft) => {
          stateDraft.isGlobalBannerDismissed = true;
        });
      },
    },
  ] as const;
}

export const {
  Provider: LayoutStateProvider,
  useContainer: useLayoutStateContainer,
} = createContainer(useLayoutState);
