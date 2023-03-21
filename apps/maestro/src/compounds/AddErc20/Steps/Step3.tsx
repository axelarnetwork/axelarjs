import { FC } from "react";

import { TextInput } from "@axelarjs/ui";

import { StepProps } from ".";

export const Step3: FC<StepProps> = (props: StepProps) => {
  return (
    <div className="grid grid-cols-1 gap-y-2">
      <label className="text-sm">Amount to mint (leave zero for none)</label>
      <TextInput
        inputSize={"md"}
        type={"number"}
        color={"primary"}
        value={props.amountToMint}
        onChange={(e) => props.setAmountToMint(parseInt(e.target.value))}
        placeholder="Input your amount to mint"
      />
    </div>
  );
};
