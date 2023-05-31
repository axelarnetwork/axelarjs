import { createContainer } from "@axelarjs/utils/react";
import { useState, type FC } from "react";

function useLayoutState() {
  const [DrawerSideContent, setDrawerSideContent] = useState<FC>(
    () => () => null
  );
  const [isOpen, setIsOpen] = useState(false);

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
      isOpen,
    },
    {
      setDrawerSideContent: _setDrawerSideContent,
      openDrawer: () => setIsOpen(true),
      closeDrawer: () => setIsOpen(false),
      toggleDrawer: () => setIsOpen((isOpen) => !isOpen),
      openDrawerWithContent: (value: FC) => {
        _setDrawerSideContent(value);
        setIsOpen(true);
      },
    },
  ] as const;
}

export const {
  Provider: LayoutStateProvider,
  useContainer: useLayoutStateContainer,
} = createContainer(useLayoutState);
