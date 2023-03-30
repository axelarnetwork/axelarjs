import { ComponentProps, FC, useState } from "react";

import tw from "tailwind-styled-components";
import { createContainer } from "unstated-next";

const StyledReactComponent = tw.div``;

const INITIAL_STATE = {
  count: 0,
};

type ReactComponentState = typeof INITIAL_STATE;

function useReactComponentState(
  initialState: ReactComponentState = INITIAL_STATE
) {
  const [state, setState] = useState(initialState);

  return [
    state,
    {
      increment: () =>
        setState((state) => ({ ...state, count: state.count + 1 })),
      decrement: () =>
        setState((state) => ({ ...state, count: state.count - 1 })),
    },
  ] as const;
}

export const {
  Provider: ReactComponentStateProvider,
  useContainer: useReactComponentStateContainer,
} = createContainer(useReactComponentState);

export type ReactComponentProps = ComponentProps<
  typeof StyledReactComponent
> & {};

const ReactComponentInner: FC<ReactComponentProps> = (props) => {
  const [state] = useReactComponentStateContainer();
  return (
    <StyledReactComponent>
      <div>Count: {state.count}</div>
      {props.children}
    </StyledReactComponent>
  );
};

const ReactComponentWithProvider = (props: ReactComponentProps) => {
  return (
    <ReactComponentStateProvider initialState={INITIAL_STATE}>
      <ReactComponentInner {...props} />
    </ReactComponentStateProvider>
  );
};

export const ReactComponent = Object.assign(ReactComponentWithProvider, {
  IncrementButton: () => {
    const [, { increment }] = useReactComponentStateContainer();
    return <button onClick={increment}>+</button>;
  },
  DecrementButton: () => {
    const [, { decrement }] = useReactComponentStateContainer();
    return <button onClick={decrement}>-</button>;
  },
});
