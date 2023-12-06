import { Button, Dialog, LinkButton } from "@axelarjs/ui";
import { useWindowSize } from "@axelarjs/ui/hooks";
import { cn } from "@axelarjs/ui/utils";
import { useMemo, type FC } from "react";
import dynamic from "next/dynamic";

import EVMChainsDropdown from "~/ui/components/EVMChainsDropdown";
import {
  InterchainTokenDeploymentStateProvider,
  useInterchainTokenDeploymentStateContainer,
  type TokenDetails,
} from "./InterchainTokenDeployment.state";
import { PrevButton } from "./steps/shared";

const StepLoading = () => (
  <div className="grid h-64 place-items-center">
    <LinkButton
      loading
      variant="ghost"
      length="block"
      className="pointer-events-none"
    >
      Loading...
    </LinkButton>
  </div>
);

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
        <Button
          {...props}
          size="md"
          className="w-full max-w-xs md:max-w-md"
          variant="primary"
        >
          Deploy a new Interchain Token
        </Button>
      )}
    >
      <Dialog.Body $as="section">
        <Dialog.CornerCloseAction onClick={actions.reset} />
        <Dialog.Title className="flex items-center gap-1 sm:gap-2">
          {showBackButton && (
            <PrevButton
              onClick={actions.prevStep}
              shape="square"
              size="lg"
              className="absolute left-0 top-0 rounded-none rounded-br-2xl"
            />
          )}
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
