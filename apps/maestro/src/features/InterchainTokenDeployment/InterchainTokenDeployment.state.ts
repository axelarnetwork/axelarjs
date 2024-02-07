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
  hex64Literal,
  numericString,
  optionalHex40Literal,
} from "~/lib/utils/validation";

const TOKEN_DETAILS_FORM_SCHEMA = z.object({
  tokenName: z.string().min(1).max(32),
  tokenSymbol: z.string().min(1).max(11),
  tokenDecimals: z.coerce.number().min(0).max(18),
  initialSupply: numericString(),
  isMintable: z.boolean(),
  minter: optionalHex40Literal(),
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
    initialSupply: "0",
    isMintable: false,
    minter: "" as `0x${string}` | undefined,
    salt: undefined as `0x${string}` | undefined,
  },
  txState: { type: "idle" } as DeployAndRegisterTransactionState,
  selectedChains: [] as string[],
  onDeployTxHash(txHash: `0x${string}`) {
    logger.log("onDeployTxHash", txHash);
  },
};

export type InterchainTokenDeploymentState = typeof INITIAL_STATE;

export type TokenDetails = InterchainTokenDeploymentState["tokenDetails"];

function useInterchainTokenDeploymentState(
  partialInitialState: Partial<InterchainTokenDeploymentState> = INITIAL_STATE
) {
  const initialState = {
    ...INITIAL_STATE,
    ...(partialInitialState ?? {}),
  };

  const [state, setState] = useSessionStorageState(
    "@maestro/interchain-deployment",
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
   * also set the default value for minter
   */
  useEffect(
    () => {
      const salt = generateRandomHash();

      tokenDetailsForm.setValue("salt", salt);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [address]
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
      tokenDetailsForm,
    },
    actions: {
      reset: () => {
        setState((draft) => {
          Object.assign(draft, initialState);

          // reset form
          tokenDetailsForm.reset(initialState.tokenDetails);

          tokenDetailsForm.setValue("salt", generateRandomHash());
          // tokenDetailsForm.setValue("minter", address);
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
      setStep: (step: number) => {
        setState((draft) => {
          draft.step = step;
        });
      },
      nextStep: () => setState((draft) => draft.step++),
      prevStep: () => setState((draft) => draft.step--),
      generateRandomSalt: () => {
        setState((draft) => {
          const salt = generateRandomHash();
          draft.tokenDetails.salt = salt;
          tokenDetailsForm.setValue("salt", salt);
        });
      },
      setCurrentAddressAsMinter: () => {
        setState((draft) => {
          draft.tokenDetails.minter = address;
          tokenDetailsForm.setValue("minter", address);
        });
      },
      resetIsMintable: () => {
        setState((draft) => {
          draft.tokenDetails.isMintable = false;
          tokenDetailsForm.setValue("isMintable", false);
        });
      },
      resetMinter: () => {
        setState((draft) => {
          draft.tokenDetails.minter = "" as `0x${string}`;
          tokenDetailsForm.setValue("minter", "" as `0x${string}`);
        });
      },
    },
  };
}

export const {
  Provider: InterchainTokenDeploymentStateProvider,
  useContainer: useInterchainTokenDeploymentStateContainer,
} = createContainer(useInterchainTokenDeploymentState);
