import { Maybe } from "@axelarjs/utils";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function useQueryStringState<TState extends string>(
  key: string,
  initialState: TState | (() => TState) = "" as TState
) {
  const searchParams = useSearchParams();

  const [state, setState] = useState<TState>(() =>
    Maybe.of(searchParams.get(key)).mapOr(
      typeof initialState === "function" ? initialState() : initialState,
      (value) => value as TState
    )
  );

  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set(key, state);
    window.history.pushState({}, "", url);
  }, [state, key, searchParams]);

  return [state, setState] as const;
}
