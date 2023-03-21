import { FC, useState } from "react";

import { Tooltip } from "@axelarjs/ui";

import { useEstimateGasFeeMultipleChains } from "~/lib/api/axelarjsSDK/hooks";
import { useEVMChainConfigsQuery } from "~/lib/api/axelarscan/hooks";

import { StepProps } from ".";

const useStep3ChainSelectionState = () => {
  const [selectedChains, setSelectedChains] = useState(new Set());

  const addSelectedChain = (item: any) => {
    setSelectedChains((prev) => new Set(prev).add(item));
  };

  const removeSelectedChain = (item: any) => {
    setSelectedChains((prev) => {
      const next = new Set(prev);

      next.delete(item);

      return next;
    });
  };

  return {
    state: { selectedChains },
    actions: { addSelectedChain, removeSelectedChain },
  };
};
export const Step3: FC<StepProps> = (props: StepProps) => {
  const { data: evmChains } = useEVMChainConfigsQuery();

  const { state, actions } = useStep3ChainSelectionState();

  // const gasPrice = useEstimateGasFeeMultipleChains({})
  return (
    <div>
      <label>Chains to deploy remote tokens</label>
      <div className="my-5 flex flex-wrap gap-5">
        {evmChains?.map((chain) => {
          const isSelected = state.selectedChains.has(chain.chain_name);
          return (
            <Tooltip tip={chain.name}>
              <img
                className={
                  "cursor-pointer" +
                  (isSelected ? " rounded-3xl border-4 border-sky-500" : "")
                }
                onClick={() => {
                  if (isSelected) {
                    actions.removeSelectedChain(chain.chain_name);
                  } else {
                    actions.addSelectedChain(chain.chain_name);
                  }
                }}
                src={`${process.env.NEXT_PUBLIC_EXPLORER_URL}${chain.image}`}
                width={`30px`}
                height={`30px`}
              />
            </Tooltip>
          );
        })}
      </div>
    </div>
  );
};
