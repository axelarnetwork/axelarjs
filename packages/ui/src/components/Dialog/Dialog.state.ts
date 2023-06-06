import { createContainer } from "@axelarjs/utils/react";
import { useEffect, useState } from "react";

import { not } from "rambda";

function useDialogState(initialOpen = false) {
  const [isOpen, setIsOpen] = useState(initialOpen);

  useEffect(() => {
    if (initialOpen === undefined) {
      return;
    }
    setIsOpen(initialOpen);
  }, [initialOpen]);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  const toggle = () => setIsOpen(not);

  return [{ isOpen }, { open, close, toggle }] as const;
}

export const {
  Provider: DialogStateProvider,
  useContainer: useDialogStateContiner,
} = createContainer(useDialogState);
