import { FC, useCallback, useState } from "react";

import { LinkButton, useIntervalAsync } from "@axelarjs/ui";

import { queryTransactionStatus } from "~/lib/api/axelarscan";

import { StepProps } from ".";

export const Step4: FC<StepProps> = (props: StepProps) => {
  const [delay, setDelay] = useState<number | null>(10000);

  const setToMap = (set: Set<string>) => {
    const map = new Map();
    set.forEach((k) => map.set(k.toLowerCase(), "called"));
    return map;
  };
  const [statusMap, setStatusMap] = useState(setToMap(props.selectedChains));
  const updateStatusMap = (chainId: string, status: string) => {
    setStatusMap(new Map(statusMap.set(chainId, status)));
  };
  const updateState = useCallback(async () => {
    const { data } = await queryTransactionStatus(props.txHash);
    data.forEach((tx: any) => {
      const { destinationChain } = tx.call.returnValues;
      if (statusMap.get(destinationChain.toLowerCase()) !== tx.status) {
        updateStatusMap(destinationChain.toLowerCase(), tx.status);
      }
    });
    if (data.every((tx: any) => tx.status === "executed")) setDelay(null);
    return data;
  }, [props.txHash, updateStatusMap, statusMap]);

  useIntervalAsync(updateState, delay);

  console.log("statusMap", statusMap);
  const getStatuses = () => {
    let divs = [<div>hi</div>];
    statusMap.forEach((status: string, chainId: string) => {
      console.log(chainId + " = " + status);
      divs.push(
        <div key={`chain-status-${chainId}`}>
          Chain: {chainId}, Status: {status}
        </div>
      );
    });
    return <div>{divs}</div>;
  };

  return (
    <div>
      <div>Deploy Token Successful</div>
      <LinkButton>{props.deployedTokenAddress}</LinkButton>
      <div>{getStatuses()}</div>
    </div>
  );
};
