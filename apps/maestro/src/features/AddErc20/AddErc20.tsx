import { Button, Dialog, LinkButton } from "@axelarjs/ui";
import { useMemo, type FC } from "react";
import dynamic from "next/dynamic";

import {
  AddErc20StateProvider,
  useAddErc20StateContainer,
  type TokenDetails,
} from "./AddErc20.state";
import { TokenRegistration } from "./TokenRegistration";

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
  const { state } = useAddErc20StateContainer();

  const CurrentStep = useMemo(() => STEPS[state.step], [state.step]);

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
        <Dialog.Title className="flex items-center gap-2">
          <TokenRegistration />
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
