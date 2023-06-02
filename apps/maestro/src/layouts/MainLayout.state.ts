import { createContainer } from "@axelarjs/utils/react";
import { useState, type FC } from "react";

function useLayoutState() {
  const [DrawerSideContent, setDrawerSideContent] = useState<FC>(
    () => () => null
  );
  const [isDrawerOpen, setDrawerOpen] = useState(false);

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
    },
  ] as const;
}

export const {
  Provider: LayoutStateProvider,
  useContainer: useLayoutStateContainer,
} = createContainer(useLayoutState);
