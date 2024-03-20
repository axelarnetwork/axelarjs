import { useEffect, useRef } from "react";

export type GenericFunction = (...args: unknown[]) => unknown;

export const useIntervalAsync = <TCallback extends GenericFunction>(
  callback: TCallback,
  delay: number | null,
) => {
  const intervalRef = useRef(null);
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    const tick = () => savedCallback.current();
    if (typeof delay === "number") {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      intervalRef.current = window.setInterval(tick, delay);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return () => window.clearInterval(intervalRef.current);
    }
  }, [delay]);

  return intervalRef;
};
