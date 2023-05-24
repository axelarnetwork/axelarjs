import { useEffect } from "react";

import { createContainer, useSessionStorageState } from "@axelarjs/utils/react";
import { uniq, without } from "rambda";

export type TransactionState =
  | {
      type: "idle";
    }
  | {
      type: "awaiting_confirmation";
    }
  | {
      type: "confirmed";
      txHash: `0x${string}`;
    }
  | {
      type: "failed";
      errorMessage: string;
    };

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

  const [state, setState] = useSessionStorageState(
    "@maestro/add-erc20",
    initialState
  );

  /**
   * Update token details with partial initial state
   */
  useEffect(
    () => {
      // abort if there's no token address
      if (!partialInitialState.tokenDetails?.tokenAddress) {
        return;
      }
      setState((draft) => {
        draft.step = partialInitialState.step ?? draft.step;
        draft.tokenDetails = {
          ...draft.tokenDetails,
          ...partialInitialState.tokenDetails,
        };
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [partialInitialState.tokenDetails]
  );

  return {
    state: {
      ...state,
      // computed state
      isPreExistingToken: Boolean(state.tokenDetails.tokenAddress),
      selectedChains: uniq(state.selectedChains),
    },
    actions: {
      reset: () => {
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
          if (
            draft.txState.type === "deploying" &&
            txState.type === "deployed"
          ) {
            // retain txHash from deploying state
            txState.txHash = draft.txState.txHash;
          }

          draft.txState = txState;
        });
      },
      toggleAdditionalChain: (item: string) => {
        setState((draft) => {
          if (draft.selectedChains.includes(item)) {
            draft.selectedChains = without([item], draft.selectedChains);
          } else {
            draft.selectedChains.push(item);
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
