import { Button, Dialog, LinkButton } from "@axelarjs/ui";
import { useMemo, type FC } from "react";
import dynamic from "next/dynamic";

import clsx from "clsx";

import EVMChainsDropdown from "~/components/EVMChainsDropdown/EVMChainsDropdown";
import {
  AddErc20StateProvider,
  useAddErc20StateContainer,
  type TokenDetails,
} from "./AddErc20.state";
import { PrevButton } from "./steps/shared";

const StepLoading = () => (
  <div className="grid h-64 place-items-center">
    <LinkButton loading ghost length="block" className="pointer-events-none">
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

  return (
    <Dialog
      renderTrigger={(props) => (
        <Button
          {...props}
          size="md"
          className="w-full max-w-xs md:max-w-md"
          color="primary"
        >
          Deploy a new ERC-20 token
        </Button>
      )}
    >
      <Dialog.Body $as="section">
        <Dialog.CornerCloseAction />
        <Dialog.Title className="flex items-center gap-1 sm:gap-2">
          {showBackButton && (
            <PrevButton
              onClick={actions.prevStep}
              shape="square"
              size="lg"
              className="absolute left-0 top-0 rounded-none rounded-br-lg"
            />
          )}

          <span
            className={clsx({
              "ml-14": showBackButton,
            })}
          >
            Register <span className="hidden sm:inline">origin</span> token on:{" "}
          </span>
          <EVMChainsDropdown
            compact
            disabled={state.isPreExistingToken}
            contentClassName={clsx("translate-x-28 sm:translate-x-40", {
              "translate-x-20 sm:translate-x-40": showBackButton,
            })}
            triggerClassName="btn-sm btn-circle"
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
