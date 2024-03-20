import { useEffect } from "react";

interface UseConfirmOnPageLeaveOptions {
  enabled?: boolean;
}

/**
 * Prompt the user with a confirmation dialog when attempting to leave the page.
 *
 * @param message - The message to display in the confirmation dialog.
 * @param options - Optional configuration options.
 * @param options.enabled - Flag to enable or disable the confirmation prompt.
 */
export function useConfirmOnPageLeave(
  message: string,
  options: UseConfirmOnPageLeaveOptions = { enabled: true },
) {
  useEffect(() => {
    if (!options.enabled) {
      return;
    }

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = message;
      return message;
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [message, options.enabled]);
}
