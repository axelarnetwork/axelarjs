import { FC } from "react";

import { LinkButton, TextInput } from "@axelarjs/ui";

import { StepProps } from ".";

export const Step4: FC<StepProps> = (props: StepProps) => {
  return (
    <div>
      <div>Deploy Token Successful</div>
      <LinkButton>{props.deployedTokenAddress}</LinkButton>
    </div>
  );
};
