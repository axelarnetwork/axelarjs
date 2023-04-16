/**
 * code adapted from @jamiebuilds/unstated-next:
 * https://github.com/jamiebuilds/unstated-next
 */

import { ComponentType, createContext, ReactNode, useContext } from "react";

const EMPTY: unique symbol = Symbol();

export interface ContainerProviderProps<State = void> {
  initialState?: State;
  children: ReactNode;
}

export interface Container<Value, State = void> {
  Provider: ComponentType<ContainerProviderProps<State>>;
  useContainer: () => Value;
}

/**
 * Creates a container with a Provider and a useContainer hook.
 * @param useHook The hook to use for creating the container value.
 * @returns The container with a Provider and a useContainer hook.
 *
 * @example
 *
 * const useCounter = (initialState = 0) => {
 *  const [count, setCount] = useState(initialState);
 *  const increment = () => setCount(count + 1);
 *  return { count, increment };
 * }
 *
 * const { Provider, useContainer } = createContainer(useCounter);
 *
 * const Counter = () => {
 *  const { count, increment } = useContainer();
 *  return (
 *    <div>
 *      <p>Count: {count}</p>
 *      <button onClick={increment}>Increment</button>
 *    </div>
 *  );
 * }
 */
export function createContainer<Value, State = void>(
  useHook: (initialState?: State) => Value
): Container<Value, State> {
  const Context = createContext<Value | typeof EMPTY>(EMPTY);

  function Provider(props: ContainerProviderProps<State>) {
    const value = useHook(props.initialState);
    return <Context.Provider value={value}>{props.children}</Context.Provider>;
  }

  function useContainer(): Value {
    const value = useContext(Context);
    if (value === EMPTY) {
      throw new Error("Component must be wrapped with <Container.Provider>");
    }
    return value;
  }

  return { Provider, useContainer };
}

export function useContainer<Value, State = void>(
  container: Container<Value, State>
): Value {
  return container.useContainer();
}
