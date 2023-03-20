import { FC, useState } from "react";

import { Button, Modal } from "@axelarjs/ui";

import { useAddErc20State } from "./AddErc20.state";

type StepProps = {
  currentStep: number;
};
export const Step1: FC<StepProps> = (props: StepProps) => {
  if (props.currentStep !== 1) return null;
  return (
    <div className="grid-col-1 grid gap-y-20">
      <Button outline>New ERC-20 token</Button>
      <Button outline>Pre-Existing ERC-20 token</Button>
    </div>
  );
};
export const Step2: FC<StepProps> = (props: StepProps) => {
  if (props.currentStep !== 2) return null;
  return <div>hi 2</div>;
};
export const Step3: FC<StepProps> = (props: StepProps) => {
  if (props.currentStep !== 3) return null;
  return <div>hi 3</div>;
};
export const Step4: FC<StepProps> = (props: StepProps) => {
  if (props.currentStep !== 4) return null;
  return <div>hi 4</div>;
};
const steps = [Step1, Step2];
type Props = {};

export const AddErc20: FC<Props> = (props) => {
  const { step, setStep } = useAddErc20State();

  return (
    <Modal
      triggerText="Deploy a new ERC-20 token"
      onCancelText="Back"
      onCancel={() => setStep(1)}
      onConfirmText="Deploy"
      cb={
        step >= 4
          ? undefined
          : () => {
              setStep(step + 1);
            }
      }
      onConfirm={
        step === 4
          ? async () => {
              setStep(1);
            }
          : undefined
      }
    >
      <Step1 currentStep={step} />
      <Step2 currentStep={step} />
      <Step3 currentStep={step} />
      <Step4 currentStep={step} />
    </Modal>
  );
};
