import { FC } from "react";

import { Steps } from "@axelarjs/ui";

export type StepsSummaryProps = {
  currentStep: number;
  newTokenType: "new" | "existing";
};
export const StepsSummary: FC<StepsSummaryProps> = (
  props: StepsSummaryProps
) => {
  return (
    <Steps className="my-10 h-24 w-full text-sm">
      <Steps.Step active={props.currentStep >= 0}>Select Flow</Steps.Step>
      <Steps.Step active={props.currentStep >= 1}>Token details</Steps.Step>
      <Steps.Step active={props.currentStep >= 2}>Deploy & Register</Steps.Step>
      <Steps.Step active={props.currentStep >= 3}>Review</Steps.Step>
    </Steps>
  );
};

export default StepsSummary;
