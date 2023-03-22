import { FC } from "react";

import { Button } from "@axelarjs/ui";

import { StepProps } from ".";

export const Step1: FC<StepProps> = (props: StepProps) => {
  return (
    <div className="grid-col-1 grid gap-y-2">
      <Button
        outline={props.newTokenType !== "new"}
        onClick={() => props.setNewTokenType("new")}
      >
        New ERC-20 token
      </Button>
      <Button
        outline={props.newTokenType !== "existing"}
        onClick={() => props.setNewTokenType("existing")}
      >
        Pre-Existing ERC-20 token
      </Button>
    </div>
  );
};
