import { generateRandomHash } from "@axelarjs/utils";
import { createContainer, useSessionStorageState } from "@axelarjs/utils/react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { uniq, without } from "rambda";
import { useAccount } from "wagmi";
import { z } from "zod";

import { logger } from "~/lib/logger";
import {
  hex40Literal,
  hex64Literal,
  numericString,
} from "~/lib/utils/validation";

const TOKEN_DETAILS_FORM_SCHEMA = z.object({
  tokenName: z.string().min(1).max(32),
  tokenSymbol: z.string().min(1).max(11),
  tokenDecimals: z.coerce.number().min(1).max(18),
  tokenCap: numericString(),
  distributor: hex40Literal().optional(),
  salt: hex64Literal(),
});

export type TokenDetailsFormState = z.infer<typeof TOKEN_DETAILS_FORM_SCHEMA>;

export type DeployAndRegisterTransactionState =
  | {
      type: "idle";
    }
  | {
      type: "pending_approval";
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
    tokenDecimals: 18,
    tokenAddress: undefined as `0x${string}` | undefined,
    tokenCap: "0",
    distributor: undefined as `0x${string}` | undefined,
    salt: "0x" as `0x${string}`,
  },
  txState: { type: "idle" } as DeployAndRegisterTransactionState,
  selectedChains: [] as string[],
  onDeployTxHash: (txHash: `0x${string}`) => {
    logger.log("onDeployTxHash", txHash);
  },
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

  const tokenDetailsForm = useForm<TokenDetailsFormState>({
    resolver: zodResolver(TOKEN_DETAILS_FORM_SCHEMA),
    defaultValues: state.tokenDetails,
  });

  const { address } = useAccount();

  /**
   * Generate a random salt on first render
   * and set it as the default value for the form
   * also set the default value for distributor
   */
  useEffect(
    () => {
      const salt = generateRandomHash();

      tokenDetailsForm.setValue("salt", salt);
      tokenDetailsForm.setValue("distributor", address);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
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
      tokenDetailsForm,
    },
    actions: {
      reset: () => {
        setState((draft) => {
          Object.assign(draft, initialState);

          // reset form
          tokenDetailsForm.reset(initialState.tokenDetails);

          tokenDetailsForm.setValue("salt", generateRandomHash());
          tokenDetailsForm.setValue("distributor", address);
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
  Provider: AddErc20StateProvider,
  useContainer: useAddErc20StateContainer,
} = createContainer(useAddErc20State);
