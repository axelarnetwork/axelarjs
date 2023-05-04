type FN<T, R> = (arg: T) => R;

/**
 * Memoize a function
 *
 * memoized function will cache the result of the function call
 *
 * @param func function to memoize
 * @returns memoized function
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
