import { describe, expect, test } from "vitest";

import { Maybe } from "./monads";

describe("Maybe", () => {
  test("of", () => {
    const value = 42;
    const maybe = Maybe.of(value);

    expect(maybe.isSome).toBe(true);
    expect(maybe.valueOr(null)).toBe(value);
  });

  test("ofFalsy", () => {
    const value = 0;
    const maybe = Maybe.ofFalsy(value);

    expect(maybe.isSome).toBe(false);
    expect(maybe.valueOr(42)).toBe(42);
  });

  test("valueOr", () => {
    const maybe = new Maybe<number>();
    const defaultValue = 42;

    expect(maybe.valueOr(defaultValue)).toBe(defaultValue);
  });

  test("map", () => {
    const value = 21;
    const maybe = Maybe.of(value);
    const mapped = maybe.map((x) => x * 2);

    expect(mapped.isSome).toBe(true);
    expect(mapped.valueOr(null)).toBe(value * 2);
  });

  test("mapOr", () => {
    const value = 21;
    const defaultValue = 84;
    const maybe = Maybe.of(value);
    const mapped = maybe.mapOr(defaultValue, (x) => x * 2);

    expect(mapped).toBe(value * 2);
  });

  test("mapOrUndefined", () => {
    const value = 21;
    const maybe = Maybe.of(value);
    const mapped = maybe.mapOrUndefined((x) => x * 2);

    expect(mapped).toBe(value * 2);
  });

  test("mapOrNull", () => {
    const value = 21;
    const maybe = Maybe.of(value);
    const mapped = maybe.mapOrNull((x) => x * 2);

    expect(mapped).toBe(value * 2);
  });

  test("empty", () => {
    const maybe = new Maybe<number>();

    expect(maybe.isSome).toBe(false);
    expect(maybe.valueOr(42)).toBe(42);
    expect(maybe.map((x) => x * 2).isSome).toBe(false);
    expect(maybe.mapOr(84, (x) => x * 2)).toBe(84);
    expect(maybe.mapOrUndefined((x) => x * 2)).toBeUndefined();
    expect(maybe.mapOrNull((x) => x * 2)).toBeNull();
  });
});
