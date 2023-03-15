import { useEffect, useState } from "react";
import { Maybe } from "../monads";

export const useStorageState = <S>(
  storage: Storage,
  key: string,
  initialState: S | (() => S)
) => {
  const [state, setState] = useState(
    Maybe.of(storage.getItem(key)).mapOr(
      initialState,
      (x) => JSON.parse(x) as S
    )
  );

  useEffect(() => {
    storage.setItem(key, JSON.stringify(state));
  }, [key, state, storage]);

  return [state, setState] as const;
};

export const useLocalStorageState = <S>(
  key: string,
  initialState: S | (() => S)
) => useStorageState(window.localStorage, key, initialState);
