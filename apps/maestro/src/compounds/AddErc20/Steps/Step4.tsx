import { FC, useCallback, useState } from "react";

import { LinkButton, useIntervalAsync } from "@axelarjs/ui";

import { searchGMP } from "~/services/gmp";

import { StepProps } from ".";

export const Step4: FC<StepProps> = (props: StepProps) => {
  const [delay, setDelay] = useState<number | null>(10000);

  const setToMap = (set: Set<string>) => {
    const map = new Map<string, string>();
    set.forEach((k) => map.set(k.toLowerCase(), "called"));
    return map;
  };
  const [statusMap, setStatusMap] = useState(setToMap(props.selectedChains));
  const updateStatusMap = useCallback(
    (chainId: string, status: string) => {
      setStatusMap(new Map(statusMap.set(chainId, status)));
    },
    [statusMap]
  );
  const updateState = useCallback(async () => {
    const { data } = await searchGMP({
      txHash: props.txHash,
    });
    data.forEach((tx) => {
      const { destinationChain } = tx.call.returnValues;
      if (statusMap.get(destinationChain.toLowerCase()) !== tx.status) {
        updateStatusMap(destinationChain.toLowerCase(), tx.status);
      }
    });
    if (data.every((tx) => tx.status === "executed")) setDelay(null);
    return data;
  }, [props.txHash, updateStatusMap, statusMap]);

  useIntervalAsync(updateState, delay);

  const getStatuses = () => {
    const divs = [...statusMap.entries()].map(([chainId, status]) => {
      return (
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
