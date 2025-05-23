import { createContainer, useSessionStorageState } from "@axelarjs/utils/react";
import { useEffect } from "react";

import { uniq, without } from "rambda";

import { logger } from "~/lib/logger";
import { RegisterCanonicalTokenResult } from "../suiHooks/useRegisterCanonicalToken";

export type DeployAndRegisterTransactionState =
  | {
      type: "idle";
    }
  | {
      type: "pending_approval";
    }
  | {
      type: "deploying";
      txHash: string;
    }
  | {
      type: "deployed";
      suiTx?: RegisterCanonicalTokenResult;
      txHash: string;
      tokenAddress: string;
    };

export const INITIAL_STATE = {
  step: 0,
  tokenDetails: {
    tokenName: "",
    tokenSymbol: "",
    tokenDecimals: 18,
    tokenAddress: "0x",
  },
  txState: { type: "idle" } as DeployAndRegisterTransactionState,
  selectedChains: [] as string[],
  onDeployTxHash: (txHash: string) => {
    logger.log("onDeployTxHash", txHash);
  },
};

export type CanonicalTokenDeploymentState = typeof INITIAL_STATE;

export type TokenDetails = CanonicalTokenDeploymentState["tokenDetails"];

function useCanonicalTokenDeploymentState(
  partialInitialState: Partial<CanonicalTokenDeploymentState> = INITIAL_STATE
) {
  const initialState = {
    ...INITIAL_STATE,
    ...(partialInitialState ?? {}),
  };

  const [state, setState] = useSessionStorageState(
    "@maestro/canonical-deployment",
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
        const shouldUpdateStep =
          (partialInitialState.step !== undefined && !draft.step) ||
          partialInitialState.tokenDetails?.tokenAddress !==
            draft.tokenDetails.tokenAddress;

        if (shouldUpdateStep) {
          draft.step = partialInitialState.step ?? draft.step;
        }

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
      selectedChains: uniq(state.selectedChains),
    },
    actions: {
      reset: () => {
        setState((draft) => {
          Object.assign(draft, initialState);
        });
      },
      setTokenDetails: (details: Partial<TokenDetails>) => {
        setState((draft) => {
          draft.tokenDetails = {
            ...draft.tokenDetails,
            ...details,
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
            draft.txState = {
              ...txState,
              txHash: draft.txState.txHash,
            };
            return;
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
      setSelectedChains: (chains: string[]) => {
        setState((draft) => {
          draft.selectedChains = chains;
        });
      },
      setStep: (step: number) => {
        setState((draft) => {
          draft.step = step;
        });
      },
      nextStep: () => setState((draft) => draft.step++),
      prevStep: () => setState((draft) => draft.step--),
    },
  };
}

export const {
  Provider: CanonicalTokenDeploymentStateProvider,
  useContainer: useCanonicalTokenDeploymentStateContainer,
} = createContainer(useCanonicalTokenDeploymentState);
