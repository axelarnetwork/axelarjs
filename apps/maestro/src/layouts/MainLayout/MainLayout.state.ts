import { createContainer, useLocalStorageState } from "@axelarjs/utils/react";
import { useState, type FC } from "react";

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
      isDrawerOpen: isDrawerOpen,
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
