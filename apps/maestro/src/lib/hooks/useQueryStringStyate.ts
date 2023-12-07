import { Maybe } from "@axelarjs/utils";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function useQueryStringState<TState extends string>(
  key: string,
  initialState: TState | (() => TState) = "" as TState
) {
  const router = useRouter();

  const [state, setState] = useState<TState>(() =>
    Maybe.of(router.query[key]).mapOr(
      typeof initialState === "function" ? initialState() : initialState,
      (value) => value as TState
    )
  );

  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set(key, state);
    window.history.pushState({}, "", url);
  }, [state, key, router.query]);

  return [state, setState] as const;
}
