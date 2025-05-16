/**
 * Creates a pair of functions to manage local storage state with events
 * @param key The key to use in localStorage
 * @param eventName The name of the custom event to dispatch
 * @returns An object with getter and setter functions
 */
export const createLocalStorageStateManager = <T>(
  key: string,
  eventName: string
) => {
  const setState = (value: T) => {
    const serializedValue =
      typeof value === "string" ? value : JSON.stringify(value);
    window.localStorage.setItem(key, serializedValue);
    window.dispatchEvent(new Event(eventName));
  };

  const getState = (): T | null => {
    const value = window.localStorage.getItem(key);
    if (value === null) return null;
    try {
      return JSON.parse(value) as T;
    } catch {
      return value as T;
    }
  };

  return {
    setState,
    getState,
    eventName,
  };
};
