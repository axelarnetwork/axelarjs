import { useState } from "react";

import { renderHook } from "@testing-library/react";

import { ContainerProviderProps, createContainer } from "./unstated";

// Example hook for testing purposes
function useCounter(initialState = 0) {
  const [count, setCount] = useState(initialState);
  const increment = () => setCount(count + 1);
  return { count, increment };
}

describe("createContainer", () => {
  it("returns a container with Provider and useContainer", () => {
    const container = createContainer(useCounter);

    expect(container.Provider).toBeDefined();
    expect(container.useContainer).toBeDefined();
  });

  it("works correctly with children and initialState", () => {
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
