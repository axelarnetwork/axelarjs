import { FC, useMemo } from "react";

import { Button, Modal } from "@axelarjs/ui";

import { useAddErc20State } from "./AddErc20.state";
import { Step1, Step2, Step3, Step4, StepsSummary } from "./Steps";
import { TokenRegistration } from "./TokenRegistration";

const STEP_MAP = [Step1, Step2, Step3, Step4];

type Props = {
  trigger?: JSX.Element;
};

export const AddErc20: FC<Props> = (props) => {
  const { state, actions } = useAddErc20State();

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
    <Modal {...conditionalProps}>
      <Modal.Body>
        <TokenRegistration />
        <StepsSummary
          currentStep={state.step}
          newTokenType={state.newTokenType}
        />
        <CurrentStep
          newTokenType={state.newTokenType}
          decimals={state.decimals}
          tokenName={state.tokenName}
          tokenSymbol={state.tokenSymbol}
          amountToMint={state.amountToMint}
          deployedTokenAddress={state.deployedTokenAddress}
          setNewTokenType={actions.setNewTokenType}
          setDecimals={actions.setDecimals}
          setTokenName={actions.setTokenName}
          setTokenSymbol={actions.setTokenSymbol}
          setAmountToMint={actions.setAmountToMint}
          incrementStep={actions.setStep.bind(null, state.step + 1)}
          setDeployedTokenAddress={actions.setDeployedTokenAddress}
        />
      </Modal.Body>
      <Modal.Actions>
        {back()}
        {forward()}
      </Modal.Actions>
    </Modal>
  );
};
