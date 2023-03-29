import { FC, useEffect, useMemo } from "react";

import { Button, Modal } from "@axelarjs/ui";
import dynamic from "next/dynamic";

import { useAddErc20State } from "./AddErc20.state";
import { TokenRegistration } from "./TokenRegistration";

const Step1 = dynamic(() => import("~/compounds/AddErc20/Steps/Step1"));
const Step2 = dynamic(() => import("~/compounds/AddErc20/Steps/Step2/Step2"));
const Step3 = dynamic(() => import("~/compounds/AddErc20/Steps/Step3/Step3"));
const Step4 = dynamic(() => import("~/compounds/AddErc20/Steps/Step4"));
const StepsSummary = dynamic(
  () => import("~/compounds/AddErc20/Steps/StepsSummary")
);

const STEP_MAP = [Step1, Step2, Step3, Step4];

type Props = {
  trigger?: JSX.Element;
  tokenAddress?: `0x${string}`;
};

export const AddErc20: FC<Props> = (props) => {
  const { state, actions } = useAddErc20State();

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
    <Modal {...conditionalProps}>
      <Modal.Body>
        <Modal.Title className="flex items-center gap-2">
          <TokenRegistration />
        </Modal.Title>
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
          txHash={state.txHash}
          selectedChains={state.selectedChains}
          tokenAlreadyRegistered={state.tokenAlreadyRegistered}
          isPreexistingToken={state.isPreExistingToken}
          setNewTokenType={actions.setNewTokenType}
          setDecimals={actions.setDecimals}
          setTokenName={actions.setTokenName}
          setTokenSymbol={actions.setTokenSymbol}
          setAmountToMint={actions.setAmountToMint}
          incrementStep={actions.setStep.bind(null, state.step + 1)}
          setDeployedTokenAddress={actions.setDeployedTokenAddress}
          setTxhash={actions.setTxHash}
          addSelectedChain={actions.addSelectedChain}
          removeSelectedChain={actions.removeSelectedChain}
          setTokenAlreadyRegistered={actions.setTokenAlreadyRegistered}
          setIsPreexistingToken={actions.setIsPreExistingToken}
        />
      </Modal.Body>
      <Modal.Actions>
        {back()}
        {forward()}
      </Modal.Actions>
    </Modal>
  );
};
export default AddErc20;
