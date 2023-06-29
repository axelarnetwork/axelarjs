import { act, renderHook } from "@testing-library/react";

import { usePersistedState } from "./usePersistedState";

// Mock Storage object
class MockStorage implements Storage {
  private store: Record<string, string> = {};

  getItem(key: string) {
    return this.store[key] || null;
  }

  setItem(key: string, value: string) {
    this.store[key] = value;
  }

  removeItem(key: string) {
    delete this.store[key];
  }

  clear() {
    this.store = {};
  }

  get length() {
    return Object.keys(this.store).length;
  }

  key(index: number) {
    return Object.keys(this.store)[index] || null;
  }
}

describe("usePersistedState", () => {
  const storage = new MockStorage();
  const key = "test";
  const defaultValue = {
    count: 42,
  };

  it("should initialize with the default value", () => {
    const { result } = renderHook(() =>
      usePersistedState(storage, key, defaultValue)
    );

    const [state] = result.current;

    expect(state).toEqual(defaultValue);
  });

  it("should update the state and storage with a new value", () => {
    const { result } = renderHook(() =>
      usePersistedState(storage, key, defaultValue)
    );

    act(() => {
      const [, setState] = result.current;
      setState({
        count: 88,
      });
    });

    const [state] = result.current;

    const expected = {
      count: 88,
    };

    expect(state).toEqual(expected);
    expect(storage.getItem(key)).toBe(JSON.stringify(expected));
  });

  it("should update the state and storage using an Immer producer function", async () => {
    const { result } = renderHook(() =>
      usePersistedState(storage, key, defaultValue)
    );

    act(() => {
      const [, setState] = result.current;
      setState((x) => {
        x.count *= 2;
      });
    });

    const [state] = result.current;

    // considering the previous test, the state should be 88 * 2 = 176
    const expected = {
      count: 176,
    };

    expect(state).toEqual(expected);
    expect(storage.getItem(key)).toBe(JSON.stringify(expected));
  });
});
