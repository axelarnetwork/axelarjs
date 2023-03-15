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
