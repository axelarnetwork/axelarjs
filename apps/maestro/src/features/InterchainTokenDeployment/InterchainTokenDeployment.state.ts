import { generateRandomHash } from "@axelarjs/utils";
import { createContainer, useSessionStorageState } from "@axelarjs/utils/react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { uniq, without } from "rambda";
import { z } from "zod";

import { stellarChainConfig, suiChainConfig } from "~/config/chains/vm-chains";
import {
  STELLAR_CHAIN_ID,
  SUI_CHAIN_ID,
  useAccount,
  useChainId,
} from "~/lib/hooks";
import { logger } from "~/lib/logger";
import { hex64Literal, numericString } from "~/lib/utils/validation";
import { DeployTokenResult } from "../suiHooks/useDeployToken";

const TOKEN_DETAILS_FORM_SCHEMA = z.object({
  tokenName: z.string().min(1).max(32),
  tokenSymbol: z.string().min(1).max(11),
  tokenDecimals: z.coerce.number().min(0).max(18),
  initialSupply: numericString(),
  isMintable: z.boolean(),
  minter: z.string().optional(),
  salt: hex64Literal(),
});

export type TokenDetailsFormState = z.infer<typeof TOKEN_DETAILS_FORM_SCHEMA>;

export type DeployAndRegisterTransactionState =
  | {
      type: "idle";
    }
  | {
      type: "pending_approval";
      step: number;
      totalSteps: number;
    }
  | {
      type: "deploying";
      txHash: string;
    }
  | {
      type: "deployed";
      suiTx?: DeployTokenResult;
      txHash: string;
      tokenAddress: string;
    };

export const INITIAL_STATE = {
  step: 0,
  tokenDetails: {
    tokenName: "",
    tokenSymbol: "",
    tokenDecimals: 18,
    tokenAddress: undefined as string | undefined,
    initialSupply: "0",
    isMintable: false,
    minter: "" as string | undefined,
    salt: undefined as `0x${string}` | undefined,
  },
  txState: { type: "idle" } as DeployAndRegisterTransactionState,
  selectedChains: [] as string[],
  onDeployTxHash(txHash: string) {
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
  const chainId = useChainId();

  /**
   * Generate a random salt on first render
   * and set it as the default value for the form
   * also set the default value for minter
   */
  useEffect(
    () => {
      const salt = generateRandomHash();

      tokenDetailsForm.setValue("salt", salt);

      if (chainId === SUI_CHAIN_ID) {
        tokenDetailsForm.setValue(
          "tokenDecimals",
          suiChainConfig.nativeCurrency.decimals
        );
      }

      if (chainId === STELLAR_CHAIN_ID) {
        tokenDetailsForm.setValue(
          "tokenDecimals",
          stellarChainConfig.nativeCurrency.decimals
        );
      }
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

          if (chainId === SUI_CHAIN_ID) {
            tokenDetailsForm.setValue(
              "tokenDecimals",
              suiChainConfig.nativeCurrency.decimals
            );
          }

          if (chainId === STELLAR_CHAIN_ID) {
            tokenDetailsForm.setValue(
              "tokenDecimals",
              stellarChainConfig.nativeCurrency.decimals
            );
          }

          tokenDetailsForm.setValue("salt", generateRandomHash());
          // tokenDetailsForm.setValue("minter", address);
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
          draft.tokenDetails.minter = "" as string;
          tokenDetailsForm.setValue("minter", "" as string);
        });
      },
    },
  };
}

export const {
  Provider: InterchainTokenDeploymentStateProvider,
  useContainer: useInterchainTokenDeploymentStateContainer,
} = createContainer(useInterchainTokenDeploymentState);
