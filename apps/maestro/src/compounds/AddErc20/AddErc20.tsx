import { FC, useEffect, useMemo } from "react";

import { LinkButton, Modal } from "@axelarjs/ui";
import dynamic from "next/dynamic";

import {
  AddErc20StateProvider,
  useAddErc20StateContainer,
} from "./AddErc20.state";
import { TokenRegistration } from "./TokenRegistration";

const StepLoading = () => (
  <div className="grid h-64 place-items-center">
    <LinkButton loading ghost length="block" className="pointer-events-none">
      Loading...
    </LinkButton>
  </div>
);

const Step1 = dynamic(() => import("~/compounds/AddErc20/steps/Step1"), {
  loading: StepLoading,
});

const Step2 = dynamic(() => import("~/compounds/AddErc20/steps/Step2"), {
  loading: StepLoading,
});

const Step3 = dynamic(() => import("~/compounds/AddErc20/steps/Step3"), {
  loading: StepLoading,
});

const Step4 = dynamic(() => import("~/compounds/AddErc20/steps/Step4"), {
  loading: StepLoading,
});

const StepsSummary = dynamic(
  () => import("~/compounds/AddErc20/steps/StepsSummary")
);

const STEP_MAP = [Step1, Step2, Step3, Step4];

type AddErc20Props = {
  trigger?: JSX.Element;
  tokenAddress?: `0x${string}`;
};

export const AddErc20: FC<AddErc20Props> = (props) => {
  const { state, actions } = useAddErc20StateContainer();

  useEffect(() => {
    if (!props.tokenAddress) {
      return;
    }
    actions.setDeployedTokenAddress(props.tokenAddress);
    actions.setStep(1);
    actions.setIsPreExistingToken(true);
    actions.setNewTokenType("existing");
  }, [actions, props.tokenAddress]);

  const CurrentStep = useMemo(() => STEP_MAP[state.step], [state.step]);

  const conditionalProps = props.trigger
    ? { trigger: props.trigger }
    : { triggerLabel: "Deploy a new ERC-20 token" };

  return (
    <Modal {...conditionalProps} hideCloseButton>
      <Modal.Body>
        <Modal.Title className="flex items-center gap-2">
          <TokenRegistration />
        </Modal.Title>
        <StepsSummary
          currentStep={state.step}
          newTokenType={state.newTokenType}
        />
        <CurrentStep />
      </Modal.Body>
    </Modal>
  );
};

const AddErc20WithProvider = (props: AddErc20Props) => {
  return (
    <AddErc20StateProvider>
      <AddErc20 {...props} />
    </AddErc20StateProvider>
  );
};

export default AddErc20WithProvider;
