import { FC, useCallback, useState } from "react";

import { Button, LinkButton, Tooltip } from "@axelarjs/ui";
import Image from "next/image";
import { useNetwork } from "wagmi";

import { useEstimateGasFeeMultipleChains } from "~/lib/api/axelarjsSDK/hooks";
import { useEVMChainConfigsQuery } from "~/lib/api/axelarscan/hooks";

import { StepProps } from ".";
import { useDeployAndRegisterInterchainTokenMutation } from "../hooks/useDeployAndRegisterInterchainTokenMutation";

function useStep3ChainSelectionState() {
  const [selectedChains, setSelectedChains] = useState(new Set<string>());
  const network = useNetwork();
  const [deployedTokenAddress, setDeployedTokenAddress] = useState("");
  const [isDeploying, setIsDeploying] = useState(false);
  const resetState = () => {
    setSelectedChains(new Set<string>());
    setDeployedTokenAddress("");
    setIsDeploying(false);
  };

  const addSelectedChain = (item: string) =>
    setSelectedChains((prev) => new Set(prev).add(item));

  const removeSelectedChain = (item: string) => {
    setSelectedChains((prev) => {
      if (!prev.has(item)) return prev;
      const next = new Set(prev);
      next.delete(item);
      return next;
    });
  };

  return {
    state: { selectedChains, deployedTokenAddress, network, isDeploying },
    actions: {
      addSelectedChain,
      removeSelectedChain,
      setDeployedTokenAddress,
      resetState,
      setIsDeploying,
    },
  };
}

export const Step3: FC<StepProps> = (props: StepProps) => {
  const { data: evmChains } = useEVMChainConfigsQuery();
  const { state, actions } = useStep3ChainSelectionState();
  const { isDeploying, network } = state;
  const { setIsDeploying } = actions;
  const {
    data: gasFees,
    isLoading: isGasPriceQueryLoading,
    isError: isGasPriceQueryError,
    error,
  } = useEstimateGasFeeMultipleChains({
    sourceChainId: evmChains?.find(
      (evmChain) => evmChain.chain_id === network.chain?.id
    )?.chain_name as string,
    destinationChainIds: Array.from(state.selectedChains),
    gasLimit: 1_000_000,
    gasMultipler: 2,
  });
  console.log("gasFees", error, gasFees);

  const { mutateAsync: deployAndRegisterToken } =
    useDeployAndRegisterInterchainTokenMutation();

  const handleDeploy = useCallback(async () => {
    if (isGasPriceQueryLoading || isGasPriceQueryError || !gasFees) {
      console.warn("gas prices not loaded");
      return;
    }
    setIsDeploying(true);
    await deployAndRegisterToken({
      tokenName: props.tokenName,
      tokenSymbol: props.tokenSymbol,
      decimals: props.decimals,
      destinationChainIds: Array.from(state.selectedChains),
      gasFees,
      sourceChainId: evmChains?.find(
        (evmChain) => evmChain.chain_id === network.chain?.id
      )?.chain_name as string,
      onStatusUpdate: (data) =>
        actions.setDeployedTokenAddress(data.tokenAddress as string),
    });
    setIsDeploying(false);
  }, [
    isGasPriceQueryLoading,
    isGasPriceQueryError,
    gasFees,
    deployAndRegisterToken,
    props.tokenName,
    props.tokenSymbol,
    props.decimals,
    state.selectedChains,
    evmChains,
    network.chain?.id,
  ]);

  if (state.deployedTokenAddress)
    return (
      <div>
        <div>Deploy Token Successful</div>
        <LinkButton>{state.deployedTokenAddress}</LinkButton>
      </div>
    );

  return (
    <div className="flex flex-col">
      <label>Chains to deploy remote tokens</label>
      <div className="my-5 flex flex-wrap gap-5">
        {evmChains?.map((chain) => {
          const isSelected = state.selectedChains.has(chain.chain_name);
          return (
            <Tooltip tip={chain.name} key={chain.chain_name}>
              <Button
                ghost
                shape="circle"
                className="h-[30] w-[30] rounded-full"
                size="sm"
                color="primary"
                outline={isSelected}
                onClick={() => {
                  const action = isSelected
                    ? actions.removeSelectedChain
                    : actions.addSelectedChain;

                  action(chain.chain_name);
                }}
              >
                <Image
                  className="pointer-events-none rounded-full"
                  src={`${process.env.NEXT_PUBLIC_EXPLORER_URL}${chain.image}`}
                  width={24}
                  height={24}
                  alt="chain logo"
                />
              </Button>
            </Tooltip>
          );
        })}
      </div>
      <Button loading={isDeploying} onClick={handleDeploy}>
        Deploy
      </Button>
    </div>
  );
};
