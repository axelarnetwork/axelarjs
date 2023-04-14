import { usePersistedState } from "@axelarjs/ui";
import { uniq, without } from "rambda";
import { createContainer } from "unstated-next";

export type DeployAndRegisterTransactionState =
  | {
      type: "idle";
    }
  | {
      type: "deploying";
      txHash: `0x${string}`;
    }
  | {
      type: "deployed";
      txHash: `0x${string}`;
      tokenAddress: `0x${string}`;
    };

export const INITIAL_STATE = {
  step: 0,
  tokenDetails: {
    tokenName: "",
    tokenSymbol: "",
    tokenDecimals: 0,
    amountToMint: 0,
    tokenAddress: undefined as `0x${string}` | undefined,
  },
  txState: { type: "idle" } as DeployAndRegisterTransactionState,
  selectedChains: [] as string[],
  onDeployTxHash: (_txHash: `0x${string}`) => {},
};

export type AddErc20State = typeof INITIAL_STATE;

export type TokenDetails = AddErc20State["tokenDetails"];

function useAddErc20State(
  partialInitialState: Partial<AddErc20State> = INITIAL_STATE
) {
  const initialState = {
    ...INITIAL_STATE,
    ...(partialInitialState ?? {}),
  };

  const [state, setState] = usePersistedState(
    "@maestro/add-erc20",
    initialState
  );

  return {
    state: {
      ...state,
      // computed state
      isPreExistingToken: Boolean(state.tokenDetails.tokenAddress),
      selectedChains: uniq(state.selectedChains),
    },
    actions: {
      resetAllState: () => {
        setState((draft) => {
          Object.assign(draft, initialState);
        });
      },
      setTokenDetails: (detatils: Partial<TokenDetails>) => {
        setState((draft) => {
          draft.tokenDetails = {
            ...draft.tokenDetails,
            ...detatils,
          };
        });
      },
      setTxState: (txState: DeployAndRegisterTransactionState) => {
        setState((draft) => {
          draft.txState = txState;
        });
      },
      toggleAdditionalChain: (item: string) => {
        setState((draft) => {
          if (draft.selectedChains.includes(item)) {
            draft.selectedChains = without([item], draft.selectedChains);
          } else {
            draft.selectedChains.concat(item);
          }
        });
      },
      nextStep: () => setState((draft) => draft.step++),
      prevStep: () => setState((draft) => draft.step--),
    },
  };
}

export const {
  Provider: AddErc20StateProvider,
  useContainer: useAddErc20StateContainer,
} = createContainer(useAddErc20State);
