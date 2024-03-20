import { useCallback, useMemo, useState } from "react";

const isTypeOf =
  <T>(type: "string" | "number") =>
  (value: unknown): value is T =>
    // rome-ignore lint/suspicious/useValidTypeof: <explanation>
    typeof value === type;

const isNumber = isTypeOf<number>("number");
const isString = isTypeOf<string>("string");

export type SortableAs = "string" | "number";

export type SortOptions<T> = {
  sortKey: keyof T;
  sortDirection: "asc" | "desc";
  sortAs?: "string" | "number";
};

export function useSortedArray<T>(tokens: T[], defaultOptions: SortOptions<T>) {
  const [{ sortAs, sortKey, sortDirection }, setSortOptions] =
    useState(defaultOptions);

  const sorted = useMemo(() => {
    const sorted = [...tokens].sort((a, b) => {
      const aValue = a[sortKey];
      const bValue = b[sortKey];

      if (sortAs === "number" || (isNumber(aValue) && isNumber(bValue))) {
        const a = Number(aValue ?? 0);
        const b = Number(bValue ?? 0);
        return a === b ? 0 : a > b ? 1 : -1;
      }

      if (sortAs === "string" || (isString(aValue) && isString(bValue))) {
        return String(aValue).localeCompare(String(bValue));
      }
      return 0;
    });

    return sortDirection === "asc" ? sorted : [...sorted].reverse();
  }, [sortKey, sortDirection, tokens]);

  const handleSortClick = useCallback(
    (options: SortOptions<T>) => {
      if (sortKey === options.sortKey) {
        setSortOptions((x) => ({
          ...x,
          sortDirection: x.sortDirection === "asc" ? "desc" : "asc",
        }));
      } else {
        setSortOptions(options);
      }
    },
    [sortKey],
  );

  return { sorted, sortKey, sortDirection, sort: handleSortClick };
}
