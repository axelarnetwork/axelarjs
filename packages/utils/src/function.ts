export { default as throttle } from "lodash.throttle";
export { default as debounce } from "lodash.debounce";

type FN<T, R> = (arg: T) => R;

/**
 * Memoize a function
 *
 * memoized function will cache the result of the function call
 *
 * @param func function to memoize
 * @returns memoized function
 *
 * @example
 *
 * const add = (a: number, b: number) => a + b;
 * const memoizedAdd = memoize(add);
 *
 * memoizedAdd(1, 2); // 3
 */
export function memoize<T, R>(func: FN<T, R>): FN<T, R> {
  const cache = new Map<T, R>();

  return (arg: T): R => {
    const cachedResult = cache.get(arg);
    if (cachedResult !== undefined) {
      return cachedResult;
    }

    const result = func(arg);
    cache.set(arg, result);
    return result;
  };
}
