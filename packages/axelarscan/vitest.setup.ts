import matchers, {
  TestingLibraryMatchers,
} from "@testing-library/jest-dom/matchers";
import { expect } from "vitest";

declare global {
  namespace Vi {
    // rome-ignore lint/suspicious/noExplicitAny: <explanation>
    interface JestAssertion<T = any>
      extends jest.Matchers<void, T>,
        TestingLibraryMatchers<T, void> {}
  }
}

// extends Vitest's expect method with methods from react-testing-library
expect.extend(matchers);
