import { FC, useCallback, useState } from "react";

import { LinkButton, useIntervalAsync } from "@axelarjs/ui";

import { queryTransactionStatus } from "~/lib/api/axelarscan";

import { StepProps } from ".";

export const Step4: FC<StepProps> = (props: StepProps) => {
  const [count, setCount] = useState(0);
  const [delay, setDelay] = useState<number | null>(10000);

  const updateState = useCallback(async () => {
    console.log("txHashhhh", count, props.txHash, props.selectedChains);
    const response = await queryTransactionStatus(props.txHash);

    if (count < 3) {
      setCount((count) => count + 1);
    } else {
      setDelay(null);
    }
    console.log("response", response);
    return response;
  }, [props.txHash, count]);

  useIntervalAsync(updateState, delay);

  return (
    <div>
      <div>Deploy Token Successful</div>
      <LinkButton>{props.deployedTokenAddress}</LinkButton>
    </div>
  );
};
