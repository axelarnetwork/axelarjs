import { FC, useEffect, useMemo } from "react";

import { Button, Modal } from "@axelarjs/ui";
import dynamic from "next/dynamic";

import {
  AddErc20StateProvider,
  useAddErc20StateContainer,
} from "./AddErc20.state";
import { TokenRegistration } from "./TokenRegistration";

const Step1 = dynamic(() => import("~/compounds/AddErc20/Steps/Step1"));
const Step2 = dynamic(() => import("~/compounds/AddErc20/Steps/Step2/Step2"));
const Step3 = dynamic(() => import("~/compounds/AddErc20/Steps/Step3/Step3"));
const Step4 = dynamic(() => import("~/compounds/AddErc20/Steps/Step4"));
const StepsSummary = dynamic(
  () => import("~/compounds/AddErc20/Steps/StepsSummary")
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

  const back = () =>
    state.step === 0 ? (
      <Modal.CloseAction
        onClick={actions.resetAddErc20StateInputs}
        color="secondary"
      >
        Close
      </Modal.CloseAction>
    ) : (
      <Button onClick={() => actions.setStep(state.step - 1)}>Back</Button>
    );

  const forward = () =>
    state.step === STEP_MAP.length - 1 ? (
      <Modal.CloseAction
        onClick={actions.resetAddErc20StateInputs}
        color="primary"
      >
        Close
      </Modal.CloseAction>
    ) : (
      <Button onClick={actions.setStep.bind(null, state.step + 1)}>Next</Button>
    );

  const conditionalProps = props.trigger
    ? {
        trigger: props.trigger,
      }
    : {
        triggerLabel: "Deploy a new ERC-20 token",
      };

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
      <Modal.Actions>
        {back()}
        {forward()}
      </Modal.Actions>
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
