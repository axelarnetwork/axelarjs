import { describe, expect, it } from "vitest";

import { caseInsensitiveRecord, pluralizeKeys } from "./record";

describe("caseInsensitiveRecord", () => {
  it("returns the exact match for a key", () => {
    const record = { test: "value" };
    const caseInsensitive = caseInsensitiveRecord(record);

    expect(caseInsensitive["test"]).toBe("value");
  });

  it("returns the value for a key with different case", () => {
    const record = { Test: "value" };
    const caseInsensitive = caseInsensitiveRecord(record);

    expect(caseInsensitive["test"]).toBe("value");
  });

  it("returns undefined for a non-existent key", () => {
    const record = { test: "value" };
    const caseInsensitive = caseInsensitiveRecord(record);

    expect(caseInsensitive["nonExistent"]).toBeUndefined();
  });
});

describe("pluralizeKeys", () => {
  it("returns an object with pluralized keys", () => {
    const obj = {
      user: "John",
      post: "Hello, World!",
      comment: "Nice post!",
    };

    const pluralizedObj = pluralizeKeys(obj);

    expect(pluralizedObj).toEqual({
      users: "John",
      posts: "Hello, World!",
      comments: "Nice post!",
    });
  });

  it("handles an empty object", () => {
    const obj = {};

    const pluralizedObj = pluralizeKeys(obj);

    expect(pluralizedObj).toEqual({});
  });

  it("handles nested objects", () => {
    const obj = {
      user: { name: "John", age: 30 },
      post: { title: "Hello, World!", content: "This is a post." },
    };

    const pluralizedObj = pluralizeKeys(obj);

    expect(pluralizedObj).toEqual({
      users: { name: "John", age: 30 },
      posts: { title: "Hello, World!", content: "This is a post." },
    });
  });
});
