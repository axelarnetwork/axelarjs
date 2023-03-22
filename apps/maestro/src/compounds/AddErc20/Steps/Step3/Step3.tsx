import React, { FC, FormEventHandler, useCallback } from "react";

import { Button, LinkButton, Tooltip } from "@axelarjs/ui";
import Image from "next/image";

import { getNativeToken } from "~/utils/getNativeToken";

import { StepProps } from "..";
import { useDeployAndRegisterInterchainTokenMutation } from "../../hooks/useDeployAndRegisterInterchainTokenMutation";
import { useStep3ChainSelectionState } from "./Step3.state";

export const Step3: FC<StepProps> = (props: StepProps) => {
  const { state, actions } = useStep3ChainSelectionState();
  const {
    isDeploying,
    network,
    totalGasFee,
    sourceChainId,
    evmChains,
    gasFees,
    isGasPriceQueryError,
    isGasPriceQueryLoading,
    selectedChains,
  } = state;
  const { setIsDeploying, addSelectedChain, removeSelectedChain } = actions;

  const { mutateAsync: deployAndRegisterToken } =
    useDeployAndRegisterInterchainTokenMutation();

  const handleDeploy = useCallback<FormEventHandler<HTMLFormElement>>(
    async (e) => {
      e.preventDefault();

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
    },
    [
      isGasPriceQueryLoading,
      isGasPriceQueryError,
      gasFees,
      setIsDeploying,
      deployAndRegisterToken,
      props.tokenName,
      props.tokenSymbol,
      props.decimals,
      state.selectedChains,
      evmChains,
      network.chain?.id,
      actions,
    ]
  );

  if (state.deployedTokenAddress)
    return (
      <div>
        <div>Deploy Token Successful</div>
        <LinkButton>{state.deployedTokenAddress}</LinkButton>
      </div>
    );

  return (
    <form className="flex flex-col" onSubmit={handleDeploy}>
      <label>Chains to deploy remote tokens</label>
      <div className="my-5 flex flex-wrap gap-5">
        {evmChains?.map((chain) => {
          const isSelected = selectedChains.has(chain.chain_name);
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
                    ? removeSelectedChain
                    : addSelectedChain;

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
      <label className="text-md">
        Approximate cost: {totalGasFee} {getNativeToken(sourceChainId)}
      </label>
      <Button loading={isDeploying} type="submit">
        Deploy
      </Button>
    </form>
  );
};
