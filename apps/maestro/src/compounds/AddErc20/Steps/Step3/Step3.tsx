import React, { FC, FormEventHandler, useCallback } from "react";

import { Button, Tooltip } from "@axelarjs/ui";
import Image from "next/image";

import { getNativeToken } from "~/lib/utils/getNativeToken";

import { StepProps } from "..";
import { useDeployAndRegisterInterchainTokenMutation } from "../../hooks/useDeployAndRegisterInterchainTokenMutation";
import { useDeployRemoteTokensMutation } from "../../hooks/useDeployRemoteTokensMutation";
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
  const { mutateAsync: deployRemoteTokens } = useDeployRemoteTokensMutation();

  const handleSubmit = (e: any) => {
    e.preventDefault();
    // ==> dimension 1: isPreexisting (0 = no, 1 - yes)
    // ==> dimension 2: isTokenAlreadyRegistered (0 = no, 1 - yes)
    // ==> dimension 3: deployOnOtherChains (0 = no, 1 - yes)
    const decisionMatrix = [
      [
        [handleRegisterOriginToken, handleDeployAndRegisterToken],
        [null, null],
      ],
      [
        [handleRegisterOriginToken, handleRegisterAndDeployRemoteTokens],
        [null, handleDeployRemoteTokens],
      ],
    ];
    const pe = +Boolean(props.isPreexistingToken); //preexisting
    const ar = +Boolean(props.tokenAlreadyRegistered); //already-registered
    const oc = +Boolean(props.selectedChains.size > 0); //other-chains
    const decision = decisionMatrix[pe][ar][oc];
    if (decision) decision(e);
    else console.warn("no op");
  };

  const handleDeployRemoteTokens = useCallback<
    FormEventHandler<HTMLFormElement>
  >(
    async (e) => {
      e.preventDefault();
      console.log("handleDeployRemoteTokens");
      if (
        state.isGasPriceQueryLoading ||
        state.isGasPriceQueryError ||
        !state.gasFees
      ) {
        console.warn("gas prices not loaded");
        return;
      }

      actions.setIsDeploying(true);
      await deployRemoteTokens({
        tokenId: `0x` as `0x${string}`, //todo
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
    [actions.setIsDeploying, deployRemoteTokens, props]
  );

  const handleRegisterOriginToken = useCallback<
    FormEventHandler<HTMLFormElement>
  >(
    async (e) => {
      e.preventDefault();
      console.log("handleRegisterOriginToken");

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

  const handleRegisterAndDeployRemoteTokens = useCallback<
    FormEventHandler<HTMLFormElement>
  >(
    async (e) => {
      e.preventDefault();
      console.log("handleRegisterAndDeployRemoteTokens");

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
      console.log("handleDeployAndRegisterToken");

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
