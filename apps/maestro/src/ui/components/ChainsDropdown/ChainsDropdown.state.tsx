import { createContainer, useSessionStorageState } from "@axelarjs/utils/react";
import { type FC } from "react";

export const INITIAL_STATE = {
  selectedChainId: null as number | null,
  selectedChainType: null as "evm" | "vm" | null,
};

function useChainsDropdownState(initialState = INITIAL_STATE) {
  const [state, setState] = useSessionStorageState(
    "@maestro/chains-dropdown",
    initialState
  );

  const actions = {
    selectChainId: (chainId: number | null, chainType?: "evm" | "vm" | null) => {
      setState((state) => {
        state.selectedChainId = chainId;
        if (chainType !== undefined) {
          state.selectedChainType = chainType;
        }
      });
    },
    setChainType: (chainType: "evm" | "vm" | null) => {
      setState((state) => {
        state.selectedChainType = chainType;
      });
    },
  };

  return [state, actions] as const;
}

export const {
  Provider: ChainsDropdownProvider,
  useContainer: useChainsDropdownContainer,
} = createContainer(useChainsDropdownState);

export function withChainsDropdownProvider<TProps>(Component: FC<TProps>) {
  const Inner = (props: TProps) => (
    <ChainsDropdownProvider>
      <Component {...(props as TProps & JSX.IntrinsicAttributes)} />
    </ChainsDropdownProvider>
  );
  Inner.displayName = `withChainsDropdownProvider(${
    Component.displayName ?? Component.name ?? "Component"
  })`;
  return Inner;
}

// For backwards compatibility (if needed)
export const {
  Provider: EVMChainsDropdownProvider,
  useContainer: useEVMChainsDropdownContainer,
} = createContainer(useChainsDropdownState);

export const withEVMChainsDropdownProvider = withChainsDropdownProvider;
