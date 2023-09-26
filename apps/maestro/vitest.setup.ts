import matchers, {
  type TestingLibraryMatchers,
} from "@testing-library/jest-dom/matchers";
import { expect } from "vitest";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Vi {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    interface JestAssertion<T = any> extends TestingLibraryMatchers<T, void> {}
  }
}

// extends Vitest's expect method with methods from react-testing-library
expect.extend(matchers);
