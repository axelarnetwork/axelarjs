export type AnyRecord = Record<
  string,
  // rome-ignore lint/suspicious/noExplicitAny: <explanation>
  any
>;

export type PluralizeKeys<T extends AnyRecord> = {
  [K in keyof T as K extends string ? `${K}s` : never]: T[K];
};

export type CapitalizeKeys<T> = {
  [TKey in keyof T as Capitalize<string & TKey>]: T[TKey];
};
