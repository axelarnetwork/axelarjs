import { useEffect, useRef } from "react";

export function usePrevious(value: any) {
  const ref = useRef();

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    ref.current = value;
  }, [value]);

  return ref.current;
}
