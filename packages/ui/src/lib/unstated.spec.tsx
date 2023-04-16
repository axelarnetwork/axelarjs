import { useState } from "react";

import { act, renderHook } from "@testing-library/react-hooks";
import fc from "fast-check";
import { describe, expect, test } from "vitest";

import { ContainerProviderProps, createContainer } from "./unstated";

// Example hook for testing purposes
function useCounter(initialState = 0) {
  const [count, setCount] = useState(initialState);
  const increment = () => setCount(count + 1);
  return { count, increment };
}

describe("useCounter", () => {
  test("increments the count with random initial states", async () => {
    await fc.assert(
      fc.asyncProperty(fc.integer(), async (initialState: number) => {
        const { result } = renderHook(() => useCounter(initialState));
        expect(result.current.count).toBe(initialState);

        act(() => {
          result.current.increment();
        });

        expect(result.current.count).toBe(initialState + 1);
      })
    );
  });
});

describe("createContainer", () => {
  test("returns a container with Provider and useContainer", () => {
    const container = createContainer(useCounter);

    expect(container.Provider).toBeDefined();
    expect(container.useContainer).toBeDefined();
  });

  test("works correctly with children and initialState", () => {
    const container = createContainer(useCounter);
    const Wrapper = ({ children }: ContainerProviderProps) => (
      <container.Provider initialState={10}>{children}</container.Provider>
    );

    const { result } = renderHook(() => container.useContainer(), {
      wrapper: Wrapper,
    });

    expect(result.current.count).toBe(10);
  });
});
