import { Dialog } from "@axelarjs/ui";
import { cn } from "@axelarjs/ui/utils";
import { useMemo, type FC } from "react";
import dynamic from "next/dynamic";

import {
  BackButton,
  ChainsDropdown,
  StepLoading,
  StepsSummary,
  TriggerButton,
} from "~/ui/compounds/MultiStepForm";
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
    <Dialog
      onClose={actions.reset}
      renderTrigger={(props) => (
        <TriggerButton {...props}>Register interchain token</TriggerButton>
      )}
    >
      <Dialog.Body $as="section">
        <Dialog.CornerCloseAction onClick={actions.reset} />
        <Dialog.Title className="flex items-center gap-1 sm:gap-2">
          {showBackButton && <BackButton onClick={actions.prevStep} />}
          <span className={cn("-translate-y-2", { "ml-14": showBackButton })}>
            Register <span className="hidden sm:inline">origin</span> token on:{" "}
          </span>
          <ChainsDropdown disabled shift={showBackButton} />
        </Dialog.Title>
        <StepsSummary currentStep={state.step} />
        <CurrentStep />
      </Dialog.Body>
    </Dialog>
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
