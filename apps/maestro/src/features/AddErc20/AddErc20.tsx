import { Button, cn, Dialog, LinkButton, useWindowSize } from "@axelarjs/ui";
import { useMemo, type FC } from "react";
import dynamic from "next/dynamic";

import EVMChainsDropdown from "~/ui/components/EVMChainsDropdown";
import {
  AddErc20StateProvider,
  useAddErc20StateContainer,
  type TokenDetails,
} from "./AddErc20.state";
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

const Step1 = dynamic(() => import("~/features/AddErc20/steps/token-details"), {
  loading: StepLoading,
});

const Step2 = dynamic(
  () => import("~/features/AddErc20/steps/deploy-and-register"),
  {
    loading: StepLoading,
  }
);

const Step3 = dynamic(() => import("~/features/AddErc20/steps/review"), {
  loading: StepLoading,
});

const StepsSummary = dynamic(
  () => import("~/features/AddErc20/steps/StepsSummary")
);

const STEPS = [Step1, Step2, Step3];

type AddErc20Props = {
  tokenDetails?: TokenDetails;
};

const AddErc20: FC<AddErc20Props> = () => {
  const { state, actions } = useAddErc20StateContainer();

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

const AddErc20WithProvider = (props: AddErc20Props) => {
  return (
    <AddErc20StateProvider
      initialState={
        props.tokenDetails
          ? {
              tokenDetails: props.tokenDetails,
              step: 0,
            }
          : undefined
      }
    >
      <AddErc20 {...props} />
    </AddErc20StateProvider>
  );
};

export default AddErc20WithProvider;
