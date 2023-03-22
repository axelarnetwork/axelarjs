import { useEffect, useRef } from "react";

export type GenericFunction = (...args: any[]) => any;

export const useIntervalAsync = <TCallback extends GenericFunction>(
  callback: TCallback,
  delay: number | null
) => {
  const intervalRef = useRef(null);
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    const tick = () => savedCallback.current();
    if (typeof delay === "number") {
      //@ts-ignore
      intervalRef.current = window.setInterval(tick, delay);
      //@ts-ignore
      return () => window.clearInterval(intervalRef.current);
    }
  }, [delay]);

  return intervalRef;
};
