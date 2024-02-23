import { useIntersectionObserver } from "./useIntersactionObserver";

export function useIsElementInViewport(ref: React.RefObject<HTMLElement>) {
  const observed = useIntersectionObserver(ref, {
    threshold: 0.5,
  });

  return observed?.isIntersecting ?? false;
}
