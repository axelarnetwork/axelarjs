import { FC, useCallback, useState } from "react";

import { LinkButton, useIntervalAsync } from "@axelarjs/ui";

import { StepProps } from ".";

export const Step4: FC<StepProps> = (props: StepProps) => {
  const [count, setCount] = useState(0);
  const [delay, setDelay] = useState<number | null>(5000);

  const updateState = useCallback(async () => {
    const response = await fetch("https://httpbin.org/get");
    const data = await response.json();
    if (count < 3) {
      setCount((count) => count + 1);
    } else {
      setDelay(null);
    }
    console.log("data", data);
    return data;
  }, [count]);
  const interval = useIntervalAsync(updateState.bind(this), delay);

  return (
    <div>
      <div>Deploy Token Successful</div>
      <LinkButton>{props.deployedTokenAddress}</LinkButton>
    </div>
  );
};
