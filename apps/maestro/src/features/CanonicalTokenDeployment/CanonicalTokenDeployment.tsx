import { useMemo, type FC } from "react";
import dynamic from "next/dynamic";

import { MultiStepDialog, StepLoading } from "~/ui/compounds/MultiStepForm";
import {
  CanonicalTokenDeploymentStateProvider,
  useCanonicalTokenDeploymentStateContainer,
  type TokenDetails,
} from "./CanonicalTokenDeployment.state";

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

const CanonicalTokenDeployment: FC = () => {
  const { state, actions } = useCanonicalTokenDeploymentStateContainer();

  const CurrentStep = useMemo(() => STEPS[state.step], [state.step]);

  const showBackButton = useMemo(
    () => state.step !== 0 && state.step !== 2,
    [state.step]
  );

  return (
    <MultiStepDialog
      triggerLabel="Register interchain token"
      step={state.step}
      showBackButton={showBackButton}
      onBackClick={actions.prevStep}
      onClose={actions.reset}
      disableChainsDropdown
    >
      <CurrentStep />
    </MultiStepDialog>
  );
};

type CanonicalTokenDeploymentProps = {
  tokenDetails?: TokenDetails;
};

const CanonicalTokenDeploymentWithProvider: FC<
  CanonicalTokenDeploymentProps
> = (props) => {
  return (
    <CanonicalTokenDeploymentStateProvider
      initialState={
        props.tokenDetails
          ? {
              tokenDetails: props.tokenDetails,
              step: 1,
            }
          : undefined
      }
    >
      <CanonicalTokenDeployment />
    </CanonicalTokenDeploymentStateProvider>
  );
};

export default CanonicalTokenDeploymentWithProvider;
