export const isDefined = <T>(argument: T | undefined | null): argument is T =>
  argument !== undefined && argument !== null;
