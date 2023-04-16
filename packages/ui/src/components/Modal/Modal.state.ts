import { useEffect, useState } from "react";

import { createContainer } from "@axelarjs/utils/react";

function useModalState(initialOpen = false) {
  const [isOpen, setIsOpen] = useState(initialOpen);

  useEffect(() => {
    if (initialOpen === undefined) {
      return;
    }
    setIsOpen(initialOpen);
  }, [initialOpen]);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  return [isOpen, { open, close }] as const;
}

export const {
  Provider: ModalStateProvider,
  useContainer: useModalStateContiner,
} = createContainer(useModalState);
