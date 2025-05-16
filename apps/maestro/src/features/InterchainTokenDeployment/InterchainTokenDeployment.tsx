import { cn, Dialog } from "@axelarjs/ui";
import { useMemo, type FC } from "react";
import dynamic from "next/dynamic";

import { STELLAR_CHAIN_ID, useAccount } from "~/lib/hooks";
import {
  BackButton,
  ChainsDropdown,
  MultiStepDialog,
  StepLoading,
} from "~/ui/compounds/MultiStepForm";
import {
  InterchainTokenDeploymentStateProvider,
  useInterchainTokenDeploymentStateContainer,
  type TokenDetails,
} from "./InterchainTokenDeployment.state";

const Step1 = dynamic(() => import("./steps/token-details"), {
  loading: StepLoading,
});

const Step2 = dynamic(() => import("./steps/deploy-and-register"), {
  loading: StepLoading,
});

const Step3 = dynamic(() => import("./steps/review"), {
  loading: StepLoading,
});

const STEPS = [Step1, Step2, Step3];

type InterchainTokenDeploymentProps = {
  tokenDetails?: TokenDetails;
};

const InterchainTokenDeployment = () => {
  const { state, actions } = useInterchainTokenDeploymentStateContainer();

  const CurrentStep = useMemo(() => STEPS[state.step], [state.step]);

  const showBackButton = useMemo(
    () => state.step > 0 && state.step < 2,
    [state.step]
  );
  const { chain: currentConnectedChain } = useAccount();

  const isStellarChain = currentConnectedChain?.id === STELLAR_CHAIN_ID;

  const disableChainDropdown = useMemo(
    () =>
      state.txState.type !== "idle" ||
      (state.step > 0 && state.selectedChains.length > 0),
    [state]
  );

  return (
    <MultiStepDialog
      triggerLabel={`${isStellarChain ? "Stellar Deployments Coming Soon" : "Deploy a new Interchain Token"}`}
      disabled={isStellarChain}
      title={
        <Dialog.Title className="flex items-center justify-center gap-1 sm:gap-2">
          {showBackButton && <BackButton onClick={actions.prevStep} />}
          <span
            className={cn("-translate-y-2", {
              "ml-14": showBackButton,
            })}
          >
            Deploy token on:{" "}
          </span>
          <ChainsDropdown
            shift={showBackButton}
            disabled={disableChainDropdown}
          />
        </Dialog.Title>
      }
      steps={["Token details", "Register & Deploy", "Review"]}
      step={state.step}
      showBackButton={showBackButton}
      onBackClick={actions.prevStep}
      onClose={actions.reset}
      disableChainsDropdown={disableChainDropdown}
      disableClose={
        state.txState.type !== "idle" && state.txState.type !== "deployed"
      }
    >
      <CurrentStep />
    </MultiStepDialog>
  );
};

const InterchainTokenDeploymentWithProvider: FC<
  InterchainTokenDeploymentProps
> = (props) => {
  return (
    <InterchainTokenDeploymentStateProvider
      initialState={
        props.tokenDetails
          ? {
              tokenDetails: props.tokenDetails,
              step: 0,
            }
          : undefined
      }
    >
      <InterchainTokenDeployment />
    </InterchainTokenDeploymentStateProvider>
  );
};

export default InterchainTokenDeploymentWithProvider;
