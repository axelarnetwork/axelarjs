import { convertCase } from "./case"; // Assuming the convertCase function is in a separate file

const TEST_CASES = [
  {
    name: "PascalCase to snake_case",
    from: "PascalCase",
    to: "snake_case",
    input: "HelloWorld",
    expected: "hello_world",
  },
  {
    name: "CONSTANT_CASE to camelCase",
    from: "CONSTANT_CASE",
    to: "camelCase",
    input: "MY_CONSTANT",
    expected: "myConstant",
  },
  {
    name: "camelCase to PascalCase",
    from: "camelCase",
    to: "PascalCase",
    input: "helloWorld",
    expected: "HelloWorld",
  },
  {
    name: "snake_case to CONSTANT_CASE",
    from: "snake_case",
    to: "CONSTANT_CASE",
    input: "hello_world",
    expected: "HELLO_WORLD",
  },
  {
    name: "PascalCase to camelCase",
    from: "PascalCase",
    to: "camelCase",
    input: "HelloWorld",
    expected: "helloWorld",
  },
  {
    name: "CONSTANT_CASE to snake_case",
    from: "CONSTANT_CASE",
    to: "snake_case",
    input: "MY_CONSTANT",
    expected: "my_constant",
  },
  {
    name: "camelCase to CONSTANT_CASE",
    from: "camelCase",
    to: "CONSTANT_CASE",
    input: "helloWorld",
    expected: "HELLO_WORLD",
  },
  {
    name: "snake_case to PascalCase",
    from: "snake_case",
    to: "PascalCase",
    input: "hello_world",
    expected: "HelloWorld",
  },
  // more complex cases, longer strings, etc.
  {
    name: "PascalCase to snake_case",
    from: "PascalCase",
    to: "snake_case",
    input: "HelloWorldFooBar",
    expected: "hello_world_foo_bar",
  },
  {
    name: "CONSTANT_CASE to camelCase",
    from: "CONSTANT_CASE",
    to: "camelCase",
    input: "MY_CONSTANT_FOO_BAR",
    expected: "myConstantFooBar",
  },
  {
    name: "camelCase to PascalCase",
    from: "camelCase",
    to: "PascalCase",
    input: "helloWorldFooBar",
    expected: "HelloWorldFooBar",
  },
  {
    name: "snake_case to CONSTANT_CASE",
    from: "snake_case",
    to: "CONSTANT_CASE",
    input: "hello_world_foo_bar",
    expected: "HELLO_WORLD_FOO_BAR",
  },
] as const;

describe("convertCase", () => {
  TEST_CASES.forEach(({ name, input, from, to, expected }) => {
    test(name, () => {
      const conversionFn = convertCase(from, to);
      const result = conversionFn(input);
      expect(result).toBe(expected);
    });
  });
});
