import { cn, Dialog } from "@axelarjs/ui";
import { useMemo, type FC } from "react";
import dynamic from "next/dynamic";

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

const Step2 = dynamic(() => import("./steps/token-settings"), {
  loading: StepLoading,
});

const Step3 = dynamic(() => import("./steps/deploy-and-register"), {
  loading: StepLoading,
});

const Step4 = dynamic(() => import("./steps/review"), {
  loading: StepLoading,
});

const STEPS = [Step1, Step2, Step3, Step4];

type InterchainTokenDeploymentProps = {
  tokenDetails?: TokenDetails;
};

const InterchainTokenDeployment = () => {
  const { state, actions } = useInterchainTokenDeploymentStateContainer();

  const CurrentStep = useMemo(() => STEPS[state.step], [state.step]);

  const showBackButton = useMemo(
    () => state.step > 0 && state.step < 3,
    [state.step]
  );

  return (
    <MultiStepDialog
      triggerLabel="Deploy a new Interchain Token"
      title={
        <Dialog.Title className="flex items-center gap-1 sm:gap-2">
          {showBackButton && <BackButton onClick={actions.prevStep} />}
          <span
            className={cn("-translate-y-2", {
              "ml-14": showBackButton,
            })}
          >
            Deploy <span className="hidden sm:inline">origin</span> token on:{" "}
          </span>
          <ChainsDropdown shift={showBackButton} />
        </Dialog.Title>
      }
      steps={["Token details", "Token Settings", "Register & Deploy", "Review"]}
      step={state.step}
      showBackButton={showBackButton}
      onBackClick={actions.prevStep}
      onClose={actions.reset}
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
