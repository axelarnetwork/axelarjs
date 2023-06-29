import { Maybe } from "./monad";

describe("Maybe", () => {
  describe("of", () => {
    it("should create a Maybe with a value", () => {
      const value = 42;
      const maybe = Maybe.of(value);

      expect(maybe.isSome).toBe(true);
      expect(maybe.valueOr(null)).toBe(value);
    });
  });

  describe("ofFalsy", () => {
    it("should create an empty Maybe for a falsy value", () => {
      const value = 0;
      const maybe = Maybe.ofFalsy(value);

      expect(maybe.isSome).toBe(false);
      expect(maybe.valueOr(42)).toBe(42);
    });
  });

  describe("valueOr", () => {
    it("should return the default value if Maybe is empty", () => {
      const maybe = new Maybe<number>();
      const defaultValue = 42;

      expect(maybe.valueOr(defaultValue)).toBe(defaultValue);
    });
  });

  describe("map", () => {
    it("should apply the function to the value of Maybe", () => {
      const value = 21;
      const maybe = Maybe.of(value);
      const mapped = maybe.map((x) => x * 2);

      expect(mapped.isSome).toBe(true);
      expect(mapped.valueOr(null)).toBe(value * 2);
    });
  });

  describe("mapOr", () => {
    it("should apply the function to the value of Maybe or return the default value", () => {
      const value = 21;
      const defaultValue = 84;
      const maybe = Maybe.of(value);
      const mapped = maybe.mapOr(defaultValue, (x) => x * 2);

      expect(mapped).toBe(value * 2);
    });
  });

  describe("mapOrUndefined", () => {
    it("should apply the function to the value of Maybe or return undefined", () => {
      const value = 21;
      const maybe = Maybe.of(value);
      const mapped = maybe.mapOrUndefined((x) => x * 2);

      expect(mapped).toBe(value * 2);
    });
  });

  describe("mapOrNull", () => {
    it("should apply the function to the value of Maybe or return null", () => {
      const value = 21;
      const maybe = Maybe.of(value);
      const mapped = maybe.mapOrNull((x) => x * 2);

      expect(mapped).toBe(value * 2);
    });
  });

  describe("empty", () => {
    it("should create an empty Maybe with various map operations", () => {
      const maybe = new Maybe<number>();

      expect(maybe.isSome).toBe(false);
      expect(maybe.valueOr(42)).toBe(42);
      expect(maybe.map((x) => x * 2).isSome).toBe(false);
      expect(maybe.mapOr(84, (x) => x * 2)).toBe(84);
      expect(maybe.mapOrUndefined((x) => x * 2)).toBeUndefined();
      expect(maybe.mapOrNull((x) => x * 2)).toBeNull();
    });
  });
});
