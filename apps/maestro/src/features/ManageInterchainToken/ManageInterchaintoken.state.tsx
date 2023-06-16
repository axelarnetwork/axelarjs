import { createContainer, useSessionStorageState } from "@axelarjs/utils/react";

import type { TransactionState } from "~/lib/hooks/useTransaction";

export type InterchainTokenAction =
  | "mint"
  //| "interchainTransfer"
  | "transferOwnership";
//  | "acceptOwnership";

export const INITIAL_STATE = {
  selectedAction: null as InterchainTokenAction | null,
  isModalOpen: false,
  transactionState: {
    status: "idle",
  } as TransactionState,
  tokenAddress: `0x` as `0x${string}`,
};

function useManageInterchainTokenState(initialState = INITIAL_STATE) {
  const [state, setState] = useSessionStorageState(
    "@maestro/manage-interchain-token",
    initialState
  );

  const actions = {
    selectAction: (action: InterchainTokenAction) => {
      setState((state) => {
        state.selectedAction = action;
      });
    },
    openModal: () => {
      setState((state) => {
        state.isModalOpen = true;
      });
    },
    closeModal: () => {
      setState((state) => {
        state.isModalOpen = false;
      });
    },
    toggleModal: () => {
      setState((state) => {
        state.isModalOpen = !state.isModalOpen;
      });
    },
    reset: () => {
      setState((draft) => {
        draft.selectedAction = null;
        draft.isModalOpen = false;
        draft.transactionState = {
          status: "idle",
        };
      });
    },
    setTransactionState: (transactionState: TransactionState) => {
      setState((state) => {
        state.transactionState = transactionState;
      });
    },
  };

  return [state, actions] as const;
}

export const {
  Provider: ManageInterchainTokenProvider,
  useContainer: useManageInterchainTokenContainer,
} = createContainer(useManageInterchainTokenState);
