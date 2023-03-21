import { FC, useCallback, useState } from "react";

import { GasToken } from "@axelar-network/axelarjs-sdk";
import { Button, Tooltip } from "@axelarjs/ui";
import { useNetwork } from "wagmi";

import { useEstimateGasFeeMultipleChains } from "~/lib/api/axelarjsSDK/hooks";
import { useEVMChainConfigsQuery } from "~/lib/api/axelarscan/hooks";

import { StepProps } from ".";
import { useDeployAndRegisterInterchainTokenMutation } from "../hooks/useDeployAndRegisterInterchainTokenMutation";

const useStep3ChainSelectionState = () => {
  const [selectedChains, setSelectedChains] = useState(new Set<string>());

  const addSelectedChain = (item: any) =>
    setSelectedChains((prev) => new Set(prev).add(item));

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

  const network = useNetwork();

  const { state, actions } = useStep3ChainSelectionState();

  const {
    data: gasFees,
    isLoading: isGasPriceQueryLoading,
    isError: isGasPriceQueryError,
  } = useEstimateGasFeeMultipleChains({
    sourceChainId: evmChains?.find(
      (evmChain) => evmChain.chain_id === network.chain?.id
    )?.chain_name as string,
    sourceChainTokenSymbol: GasToken.AVAX,
    destinationChainIds: Array.from(state.selectedChains),
  });
  console.log("gasFees", gasFees);

  const { mutateAsync: deployAndRegisterToken } =
    useDeployAndRegisterInterchainTokenMutation();

  const handleDeploy = useCallback(async () => {
    if (isGasPriceQueryLoading || isGasPriceQueryError || !gasFees) {
      console.warn("gas prices not loaded");
      return;
    }
    await deployAndRegisterToken({
      tokenName: props.tokenName,
      tokenSymbol: props.tokenSymbol,
      decimals: props.decimals,
      destinationChainIds: Array.from(state.selectedChains),
      gasFees,
      sourceChainId: evmChains?.find(
        (evmChain) => evmChain.chain_id === network.chain?.id
      )?.chain_name as string,
    });
  }, [
    props.tokenName,
    props.tokenSymbol,
    props.decimals,
    state.selectedChains,
    gasFees,
  ]);

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
      <Button onClick={handleDeploy}>Deploy</Button>
    </div>
  );
};
