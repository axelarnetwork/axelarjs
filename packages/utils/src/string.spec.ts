import {
  capitalize,
  isNilOrWhitespace,
  maskAddress,
  sluggify,
  unSluggify,
} from "./string";

describe("isNilOrWhitespace", () => {
  it("returns true for undefined", () => {
    const value = undefined;
    expect(isNilOrWhitespace(value)).toBe(true);
  });

  it("returns true for null", () => {
    const value = null;
    expect(isNilOrWhitespace(value)).toBe(true);
  });

  it("returns true for an empty string", () => {
    const value = "";
    expect(isNilOrWhitespace(value)).toBe(true);
  });

  it("returns true for a whitespace string", () => {
    const value = " ";
    expect(isNilOrWhitespace(value)).toBe(true);
  });

  it("returns false for a non-empty string", () => {
    const value = "test";
    expect(isNilOrWhitespace(value)).toBe(false);
  });
});

describe("capitalize", () => {
  it("capitalizes the first letter of a string", () => {
    const value = "hello";
    expect(capitalize(value)).toBe("Hello");
  });

  it("returns an empty string for an empty input", () => {
    const value = "";
    expect(capitalize(value)).toBe("");
  });
});

describe("sluggify", () => {
  it("converts a string into a slug", () => {
    const value = "Hello, World!";
    expect(sluggify(value)).toBe("hello-world");
  });

  it("handles special characters and spaces", () => {
    const value = "Test!@# $%&*()_-+=[]{};'<>,./?";
    expect(sluggify(value)).toBe("test");
  });
});

describe("unSluggify", () => {
  it("converts a slug back into a readable string", () => {
    const value = "hello-world";
    expect(unSluggify(value)).toBe("Hello World");
  });

  it("handles an empty slug", () => {
    const value = "";
    expect(unSluggify(value)).toBe("");
  });
});

describe("maskAddress", () => {
  it("masks an address with default options", () => {
    const address = "0x1234567890abcdef";
    expect(maskAddress(address)).toBe("0x1234...cdef");
  });

  it("masks an address with custom options", () => {
    const address = "0x1234567890abcdef";
    expect(maskAddress(address, { segmentA: 4, segmentB: -6 })).toBe(
      "0x12...abcdef"
    );
  });
});
