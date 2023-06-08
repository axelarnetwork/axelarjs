import { Steps } from "@axelarjs/ui";
import type { FC } from "react";

export type StepsSummaryProps = {
  currentStep: number;
};

const STEPS = ["Token details", "Deploy & Register", "Review"];

export const StepsSummary: FC<StepsSummaryProps> = (
  props: StepsSummaryProps
) => {
  return (
    <Steps className="my-6 h-20 w-full text-sm sm:my-10 sm:h-24">
      {STEPS.map((step, index) => (
        <Steps.Step key={step} active={props.currentStep >= index}>
          {step}
        </Steps.Step>
      ))}
    </Steps>
  );
};

export default StepsSummary;
