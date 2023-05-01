import { FC } from "react";

import { Steps } from "@axelarjs/ui";

export type StepsSummaryProps = {
  currentStep: number;
};

const STEPS = ["Token details", "Deploy & Register", "Review"];

export const StepsSummary: FC<StepsSummaryProps> = (
  props: StepsSummaryProps
) => {
  return (
    <Steps className="my-10 h-24 w-full text-sm">
      {STEPS.map((step, index) => (
        <Steps.Step key={step} active={props.currentStep >= index}>
          {step}
        </Steps.Step>
      ))}
    </Steps>
  );
};

export default StepsSummary;
