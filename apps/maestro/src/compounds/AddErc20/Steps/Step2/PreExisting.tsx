import { FC, useState } from "react";

import { TextInput } from "@axelarjs/ui";

import { StepProps } from "..";

export const PreExistingERC20Token: FC<StepProps> = (props: StepProps) => {
  const [tokenAddress, setTokenAddress] = useState("");
  return (
    <div className="grid grid-cols-1 gap-y-2">
      <label className="text-sm">Token Address {tokenAddress}</label>
      <TextInput
        inputSize={"md"}
        color={"primary"}
        value={tokenAddress}
        onChange={(e) => setTokenAddress(e.target.value)}
        placeholder="Input your token address"
      />
    </div>
  );
};
