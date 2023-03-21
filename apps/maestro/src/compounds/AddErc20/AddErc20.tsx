import { FC, useMemo } from "react";

import { Button, Modal } from "@axelarjs/ui";

import { useAddErc20State } from "./AddErc20.state";
import { Step1, Step2, Step3, StepsSummary } from "./Steps";
import { TokenRegistration } from "./TokenRegistration";

const stepMap = [Step1, Step2, Step3];

export const AddErc20: FC<{}> = () => {
  const { state, actions } = useAddErc20State();
  const {
    step,
    newTokenType,
    tokenName,
    tokenSymbol,
    decimals,
    amountToMint,
    txState,
  } = state;
  const {
    setStep,
    setNewTokenType,
    setTokenName,
    setTokenSymbol,
    setDecimals,
    setAmountToMint,
    setTxState,
    resetAddErc20StateInputs,
  } = actions;

  const CurrentStep = useMemo(() => {
    return stepMap[step];
  }, [step]);

  const back = () =>
    step === 0 ? (
      <Modal.CloseAction onClick={resetAddErc20StateInputs} color="secondary">
        Close
      </Modal.CloseAction>
    ) : (
      <Button onClick={() => setStep(step - 1)}>Back</Button>
    );

  const forward = () =>
    step === stepMap.length - 1 ? (
      <Modal.CloseAction color="primary">Close</Modal.CloseAction>
    ) : (
      <Button onClick={() => setStep(step + 1)}>Next</Button>
    );

  return (
    <Modal triggerLabel="Deploy a new ERC-20 token">
      <Modal.Body>
        <TokenRegistration />
        <StepsSummary currentStep={step} newTokenType={newTokenType} />
        <CurrentStep
          newTokenType={newTokenType}
          setNewTokenType={setNewTokenType}
          decimals={decimals}
          tokenName={tokenName}
          tokenSymbol={tokenSymbol}
          amountToMint={amountToMint}
          setDecimals={setDecimals}
          setTokenName={setTokenName}
          setTokenSymbol={setTokenSymbol}
          setAmountToMint={setAmountToMint}
        />
      </Modal.Body>
      <Modal.Actions>
        {back()}
        {forward()}
      </Modal.Actions>
    </Modal>
  );
};
