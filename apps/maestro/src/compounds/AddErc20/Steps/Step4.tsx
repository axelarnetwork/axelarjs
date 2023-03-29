import { FC, useCallback, useState } from "react";

import { CopyToClipboardButton, useIntervalAsync } from "@axelarjs/ui";

import { searchGMP } from "~/services/gmp";

import { useAddErc20StateContainer } from "../AddErc20.state";

const setToStatusMap = (set: Set<string>) => {
  const map = new Map<string, string>();
  set.forEach((k) => map.set(k.toLowerCase(), "called"));
  return map;
};

export const Step4: FC = () => {
  const { state } = useAddErc20StateContainer();
  const [delay, setDelay] = useState<number | null>(10000);
  const [statusMap, setStatusMap] = useState(
    setToStatusMap(state.selectedChains)
  );
  const updateStatusMap = useCallback(
    (chainId: string, status: string) => {
      setStatusMap(new Map(statusMap.set(chainId, status)));
    },
    [statusMap]
  );
  const updateState = useCallback(async () => {
    const { data } = await searchGMP({
      txHash: state.txHash,
    });
    if (data?.length === 0) {
      setDelay(null);
      console.warn("no gmp cutting off poll");
    }
    data.forEach((tx) => {
      const { destinationChain } = tx.call.returnValues;
      if (statusMap.get(destinationChain.toLowerCase()) !== tx.status) {
        updateStatusMap(destinationChain.toLowerCase(), tx.status);
      }
    });
    if (data.every((tx) => tx.status === "executed")) {
      setDelay(null);
    }
    return data;
  }, [state.txHash, statusMap, updateStatusMap]);

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
      <CopyToClipboardButton copyText={state.deployedTokenAddress} />
      <div>{getStatuses()}</div>
    </div>
  );
};

export default Step4;
