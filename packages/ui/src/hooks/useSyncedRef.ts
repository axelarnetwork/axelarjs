import { useEffect, useRef, type ForwardedRef } from "react";

/**
 * Returns a ref that is synced with the provided ref
 */
export function useSyncedRef<T>(ref: ForwardedRef<T>) {
  const innerRef = useRef<T>(null);

  useEffect(() => {
    if (!ref) return;

    if (typeof ref === "function") {
      ref(innerRef.current);
    } else {
      ref.current = innerRef.current;
    }
  }, [innerRef.current, ref]);

  return innerRef;
}
