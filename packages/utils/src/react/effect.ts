import {
  useEffect,
  useRef,
  type DependencyList,
  type EffectCallback,
} from "react";

export const useChangedEffect = (
  effect: EffectCallback,
  deps?: DependencyList
) => {
  const isFirstMountRef = useRef(true);

  useEffect(() => {
    if (!isFirstMountRef.current) {
      effect();
    }

    isFirstMountRef.current = false;
  }, deps);
};
