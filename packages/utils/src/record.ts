import type { AnyRecord, PluralizeKeys } from "./types";

export const caseInsensitiveRecord = <T>(record: Record<string, T>) =>
  new Proxy(record, {
    get(target, p) {
      if (typeof p === "symbol") {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return target[p];
      }

      const exactMatch = target[p];

      if (exactMatch !== undefined) {
        return exactMatch;
      }

      return Object.entries(target).find(
        ([key]) =>
          key.localeCompare(p, undefined, { sensitivity: "accent" }) === 0
      )?.[1];
    },
  });

export function pluralizeKeys<T extends AnyRecord>(obj: T) {
  const nextEntries = Object.entries(obj).map(
    ([key, value]) => [`${key}s`, value] as const
  );

  return Object.fromEntries(nextEntries) as PluralizeKeys<T>;
}

export const invert = <T extends Record<string, string>>(obj: T) =>
  Object.fromEntries(Object.entries(obj).map(([k, v]) => [v, k])) as {
    [K in keyof T as T[K]]: K;
  };
