/**
 * Type guard to check if a value is defined.
 *
 * @param argument
 * @returns true if the argument is defined, false otherwise
 *
 * @example
 *
 * const value = fnWithNullishNumericResult(); // number | null | undefined
 *
 * if (isDefined(value)) {
 *  // type of value is narrowed to number
 *  console.log(value); // 1
 * }
 */
export const isDefined = <T>(argument: T | undefined | null): argument is T =>
  argument !== undefined && argument !== null;
