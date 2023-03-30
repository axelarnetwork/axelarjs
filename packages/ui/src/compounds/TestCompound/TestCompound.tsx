import { ComponentProps, FC, useState } from "react";

import tw from "tailwind-styled-components";
import { createContainer } from "unstated-next";

const StyledTestCompound = tw.div``;

const INITIAL_STATE = {
  count: 0,
};

type TestCompoundState = typeof INITIAL_STATE;

function useTestCompoundState(initialState: TestCompoundState = INITIAL_STATE) {
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
  Provider: TestCompoundStateProvider,
  useContainer: useTestCompoundStateContainer,
} = createContainer(useTestCompoundState);

export type TestCompoundProps = ComponentProps<typeof StyledTestCompound> & {};

const TestCompoundInner: FC<TestCompoundProps> = (props) => {
  const [state] = useTestCompoundStateContainer();
  return (
    <StyledTestCompound>
      <div>Count: {state.count}</div>
      {props.children}
    </StyledTestCompound>
  );
};

const TestCompoundWithProvider = (props: TestCompoundProps) => {
  return (
    <TestCompoundStateProvider initialState={INITIAL_STATE}>
      <TestCompoundInner {...props} />
    </TestCompoundStateProvider>
  );
};

export const TestCompound = Object.assign(TestCompoundWithProvider, {
  IncrementButton: () => {
    const [, { increment }] = useTestCompoundStateContainer();
    return <button onClick={increment}>+</button>;
  },
  DecrementButton: () => {
    const [, { decrement }] = useTestCompoundStateContainer();
    return <button onClick={decrement}>-</button>;
  },
});
