import { Dialog } from "@axelarjs/ui";
import { useWindowSize } from "@axelarjs/ui/hooks";
import { cn } from "@axelarjs/ui/utils";
import { useMemo, type FC } from "react";
import dynamic from "next/dynamic";

import EVMChainsDropdown from "~/ui/components/EVMChainsDropdown";
import {
  BackButton,
  StepLoading,
  TriggerButton,
} from "~/ui/compounds/MultiStepForm";
import {
  InterchainTokenDeploymentStateProvider,
  useInterchainTokenDeploymentStateContainer,
  type TokenDetails,
} from "./InterchainTokenDeployment.state";

const Step1 = dynamic(
  () => import("~/features/InterchainTokenDeployment/steps/token-details"),
  {
    loading: StepLoading,
  }
);

const Step2 = dynamic(
  () =>
    import("~/features/InterchainTokenDeployment/steps/deploy-and-register"),
  {
    loading: StepLoading,
  }
);

const Step3 = dynamic(
  () => import("~/features/InterchainTokenDeployment/steps/review"),
  {
    loading: StepLoading,
  }
);

const StepsSummary = dynamic(
  () => import("~/features/InterchainTokenDeployment/steps/steps-summary")
);

const STEPS = [Step1, Step2, Step3];

type InterchainTokenDeploymentProps = {
  tokenDetails?: TokenDetails;
};

const InterchainTokenDeployment = () => {
  const { state, actions } = useInterchainTokenDeploymentStateContainer();

  const CurrentStep = useMemo(() => STEPS[state.step], [state.step]);

  const showBackButton = useMemo(
    () => state.step !== 0 && state.step !== 2,
    [state.step]
  );

  const { width } = useWindowSize();

  return (
    <Dialog
      onClose={actions.reset}
      renderTrigger={(props) => (
        <TriggerButton {...props}>Deploy a new Interchain Token</TriggerButton>
      )}
    >
      <Dialog.Body $as="section">
        <Dialog.CornerCloseAction onClick={actions.reset} />
        <Dialog.Title className="flex items-center gap-1 sm:gap-2">
          {showBackButton && <BackButton onClick={actions.prevStep} />}
          <span className={cn("-translate-y-2", { "ml-14": showBackButton })}>
            Register <span className="hidden sm:inline">origin</span> token on:{" "}
          </span>
          <EVMChainsDropdown
            compact
            disabled={state.isPreExistingToken}
            triggerClassName="-translate-y-1.5"
            hideLabel={width < 640}
            contentClassName={cn("translate-x-28 sm:translate-x-12 z-40", {
              "translate-x-16 sm:translate-x-0": showBackButton,
            })}
          />
        </Dialog.Title>
        <StepsSummary currentStep={state.step} />
        <CurrentStep />
      </Dialog.Body>
    </Dialog>
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
