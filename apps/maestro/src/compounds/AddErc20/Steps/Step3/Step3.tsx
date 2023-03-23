import React, { FC, FormEventHandler, useCallback } from "react";

import { Button, Tooltip } from "@axelarjs/ui";
import Image from "next/image";

import { getNativeToken } from "~/lib/utils/getNativeToken";

import { StepProps } from "..";
import { useDeployAndRegisterInterchainTokenMutation } from "../../hooks/useDeployAndRegisterInterchainTokenMutation";
import { useRegisterOriginTokenAndDeployRemoteTokensMutation } from "../../hooks/useRegisterOriginTokenAndDeployRemoteTokensMutation";
import { useRegisterOriginTokenMutation } from "../../hooks/useRegisterOriginTokenMutation";
import { useStep3ChainSelectionState } from "./Step3.state";

export const Step3: FC<StepProps> = (props: StepProps) => {
  const { state, actions } = useStep3ChainSelectionState({
    selectedChains: props.selectedChains,
  });

  const { mutateAsync: deployAndRegisterToken } =
    useDeployAndRegisterInterchainTokenMutation();
  const { mutateAsync: registerOriginTokenAndDeployRemoteTokens } =
    useRegisterOriginTokenAndDeployRemoteTokensMutation();
  const { mutateAsync: registerOriginToken } = useRegisterOriginTokenMutation();

  const handleSubmit = (e: any) => {
    e.preventDefault();
    switch (true) {
      case props.selectedChains.size > 0 && !props.tokenAlreadyRegistered:
        handleDeployAndRegisterToken(e);
        break;
      case props.selectedChains.size > 0 && props.tokenAlreadyRegistered:
        handleRegisterOriginTokenAndDeployRemoteTokens(e);
        break;
      case props.selectedChains.size === 0 && props.tokenAlreadyRegistered:
        handleRegisterOriginToken(e);
        break;
      case props.selectedChains.size === 0 && !props.tokenAlreadyRegistered:
        //TODO...what to do?
        break;
      default:
        break;
    }
  };

  const handleRegisterOriginToken = useCallback<
    FormEventHandler<HTMLFormElement>
  >(
    async (e) => {
      e.preventDefault();

      actions.setIsDeploying(true);
      await registerOriginToken({
        tokenAddress: props.deployedTokenAddress as `0x${string}`,
        onStatusUpdate: (data) => {
          props.setDeployedTokenAddress(data.tokenAddress as string);
          data.txHash && props.setTxhash(data.txHash);
        },
      });
      actions.setIsDeploying(false);
      props.incrementStep();
    },
    [actions.setIsDeploying, registerOriginToken, props]
  );

  const handleRegisterOriginTokenAndDeployRemoteTokens = useCallback<
    FormEventHandler<HTMLFormElement>
  >(
    async (e) => {
      e.preventDefault();

      if (
        state.isGasPriceQueryLoading ||
        state.isGasPriceQueryError ||
        !state.gasFees
      ) {
        console.warn("gas prices not loaded");
        return;
      }
      actions.setIsDeploying(true);
      await registerOriginTokenAndDeployRemoteTokens({
        tokenAddress: props.deployedTokenAddress as `0x${string}`,
        destinationChainIds: Array.from(props.selectedChains),
        gasFees: state.gasFees,
        onStatusUpdate: (data) => {
          props.setDeployedTokenAddress(data.tokenAddress as string);
          data.txHash && props.setTxhash(data.txHash);
        },
      });
      actions.setIsDeploying(false);
      props.incrementStep();
    },
    [
      state.isGasPriceQueryLoading,
      state.isGasPriceQueryError,
      state.gasFees,
      actions.setIsDeploying,
      registerOriginTokenAndDeployRemoteTokens,
      props,
      props.selectedChains,
    ]
  );

  const handleDeployAndRegisterToken = useCallback<
    FormEventHandler<HTMLFormElement>
  >(
    async (e) => {
      e.preventDefault();

      if (
        state.isGasPriceQueryLoading ||
        state.isGasPriceQueryError ||
        !state.gasFees
      ) {
        console.warn("gas prices not loaded");
        return;
      }
      actions.setIsDeploying(true);
      await deployAndRegisterToken({
        tokenName: props.tokenName,
        tokenSymbol: props.tokenSymbol,
        decimals: props.decimals,
        destinationChainIds: Array.from(props.selectedChains),
        gasFees: state.gasFees,
        sourceChainId: state.evmChains?.find(
          (evmChain) => evmChain.chain_id === state.network.chain?.id
        )?.chain_name as string,
        onStatusUpdate: (data) => {
          props.setDeployedTokenAddress(data.tokenAddress as string);
          data.txHash && props.setTxhash(data.txHash);
        },
      });
      actions.setIsDeploying(false);
      props.incrementStep();
    },
    [
      state.isGasPriceQueryLoading,
      state.isGasPriceQueryError,
      state.gasFees,
      actions.setIsDeploying,
      deployAndRegisterToken,
      props,
      props.selectedChains,
      state.evmChains,
      state.network.chain?.id,
    ]
  );

  return (
    <form className="flex flex-col" onSubmit={handleSubmit}>
      <label>Chains to deploy remote tokens</label>
      <div className="my-5 flex flex-wrap gap-3">
        {state.evmChains?.map((chain) => {
          const isSelected = props.selectedChains.has(chain.chain_name);
          return (
            <Tooltip tip={chain.name} key={chain.chain_name}>
              <Button
                ghost
                shape="circle"
                className="h-[40] w-[40] rounded-full"
                size="sm"
                color="primary"
                outline={isSelected}
                onClick={() => {
                  const action = isSelected
                    ? props.removeSelectedChain
                    : props.addSelectedChain;

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
        Is Token registered{" "}
        {props.tokenAlreadyRegistered
          ? "Token registered"
          : "Token isnt registered"}
      </label>
      <label className="text-md">
        Approximate cost: {state.totalGasFee}{" "}
        {getNativeToken(state.sourceChainId)}
      </label>
      <Button loading={state.isDeploying} type="submit">
        Deploy
      </Button>
    </form>
  );
};
