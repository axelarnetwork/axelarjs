import { FC, useState } from "react";

import { createContainer } from "unstated-next";

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
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
      toggle: () => setIsOpen((isOpen) => !isOpen),
      openWithSideContent: (value: FC) => {
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
