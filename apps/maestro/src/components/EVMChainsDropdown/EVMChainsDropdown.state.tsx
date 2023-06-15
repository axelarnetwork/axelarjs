import { createContainer, useSessionStorageState } from "@axelarjs/utils/react";
import { type FC } from "react";

export const INITIAL_STATE = {
  selectedChainId: null as number | null,
};

function useEVMChainsDropdownState(initialState = INITIAL_STATE) {
  const [state, setState] = useSessionStorageState(
    "@maestro/evm-chains-dropdown",
    initialState
  );

  const actions = {
    selectChainId: (chainId: number) => {
      setState((state) => {
        state.selectedChainId = chainId;
      });
    },
  };

  return [state, actions] as const;
}

export const {
  Provider: EVMChainsDropdownProvider,
  useContainer: useEVMChainsDropdownContainer,
} = createContainer(useEVMChainsDropdownState);

export function withEVMChainsDropdownProvider<TProps = {}>(
  Component: FC<TProps>
) {
  const Inner = (props: TProps) => (
    <EVMChainsDropdownProvider>
      <Component {...(props as TProps & JSX.IntrinsicAttributes)} />
    </EVMChainsDropdownProvider>
  );
  Inner.displayName = `withEVMChainsDropdownProvider(${
    Component.displayName ?? Component.name ?? "Component"
  })`;
  return Inner;
}
