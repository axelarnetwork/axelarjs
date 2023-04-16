import React, {
  FC,
  FormEvent,
  FormEventHandler,
  useCallback,
  useMemo,
  useRef,
} from "react";

import {
  Button,
  FormControl,
  Label,
  Modal,
  toast,
  Tooltip,
} from "@axelarjs/ui";
import { BigNumber } from "ethers";
import Image from "next/image";

import { getNativeToken } from "~/lib/utils/getNativeToken";

import { useAddErc20StateContainer } from "../../AddErc20.state";
import { useDeployAndRegisterInterchainTokenMutation } from "../../hooks/useDeployAndRegisterInterchainTokenMutation";
import { useRegisterOriginTokenAndDeployRemoteTokensMutation } from "../../hooks/useRegisterOriginTokenAndDeployRemoteTokensMutation";
import { NextButton, PrevButton } from "../core";
import { useStep3ChainSelectionState } from "./DeployAndRegister.state";

export const Step3: FC = () => {
  const { state: rootState, actions: rootActions } =
    useAddErc20StateContainer();

  const { state, actions } = useStep3ChainSelectionState();

  const {
    mutateAsync: deployAndRegisterToken,
    error: deployAndRegisterTokenError,
  } = useDeployAndRegisterInterchainTokenMutation();

  const {
    mutateAsync: registerPreExistingToken,
    error: registerPreExistingTokenError,
  } = useRegisterOriginTokenAndDeployRemoteTokensMutation();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (rootState.isPreExistingToken) {
      handleRegisterPreExistingToken(e);
    } else {
      handleDeployAndRegisterToken(e);
    }
  };

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

      const decimalAdjustment = BigNumber.from(10).pow(
        rootState.tokenDetails.tokenDecimals
      );
      const amountToMint = BigNumber.from(
        rootState.tokenDetails.amountToMint
      ).mul(decimalAdjustment);

      await deployAndRegisterToken(
        {
          tokenName: rootState.tokenDetails.tokenName,
          tokenSymbol: rootState.tokenDetails.tokenSymbol,
          decimals: rootState.tokenDetails.tokenDecimals,
          destinationChainIds: Array.from(rootState.selectedChains),
          amountToMint,
          gasFees: state.gasFees,
          sourceChainId: state.evmChains?.find(
            (evmChain) => evmChain.chain_id === state.network.chain?.id
          )?.chain_name as string,
          onStatusUpdate: (txState) => {
            if (txState.type === "deployed") {
              rootActions.setTxState(txState);
              rootActions.nextStep();
              actions.setIsDeploying(false);
            }
          },
        },
        {
          onError(error) {
            actions.setIsDeploying(false);
            if (error instanceof Error) {
              toast.error(`Failed to register token: ${error?.message}`);
            }
          },
        }
      );
    },
    [
      state.isGasPriceQueryLoading,
      state.isGasPriceQueryError,
      state.gasFees,
      state.evmChains,
      state.network.chain?.id,
      actions,
      rootState.tokenDetails.tokenDecimals,
      rootState.tokenDetails.amountToMint,
      rootState.tokenDetails.tokenName,
      rootState.tokenDetails.tokenSymbol,
      rootState.selectedChains,
      deployAndRegisterToken,
      rootActions,
    ]
  );

  const handleRegisterPreExistingToken = useCallback<
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

      await registerPreExistingToken(
        {
          tokenAddress: rootState.tokenDetails.tokenAddress as `0x${string}`,
          destinationChainIds: Array.from(rootState.selectedChains),
          gasFees: state.gasFees,
          onStatusUpdate: (txState) => {
            if (txState.type === "deployed") {
              rootActions.setTxState(txState);
              rootActions.nextStep();
              actions.setIsDeploying(false);
            }
          },
        },
        {
          onError(error) {
            actions.setIsDeploying(false);
            if (error instanceof Error) {
              toast.error(`Failed to register token: ${error?.message}`);
            }
          },
        }
      );
    },
    [
      state.isGasPriceQueryLoading,
      state.isGasPriceQueryError,
      state.gasFees,
      actions,
      registerPreExistingToken,
      rootState.tokenDetails.tokenAddress,
      rootState.selectedChains,
      rootActions,
    ]
  );

  const eligibleChains = useMemo(
    () =>
      state.evmChains?.filter(
        (chain) => chain.chain_id !== state.network.chain?.id
      ),
    [state.evmChains, state.network.chain?.id]
  );

  const formSubmitRef = useRef<HTMLButtonElement>(null);

  const hasTxError = Boolean(
    deployAndRegisterTokenError || registerPreExistingTokenError
  );

  return (
    <>
      <form className="grid gap-4" onSubmit={handleSubmit}>
        <FormControl>
          <Label>
            <Label.Text>Also deploy on this chains (optional):</Label.Text>

            {Boolean(state.gasFees?.length) && (
              <Label.AltText>
                <Tooltip tip="Approximate gas cost">
                  <span className="ml-2 text-xs">
                    (≈ {state.totalGasFee}{" "}
                    {state?.sourceChainId &&
                      getNativeToken(state.sourceChainId)}{" "}
                    in fees)
                  </span>
                </Tooltip>
              </Label.AltText>
            )}
          </Label>
          <div className="bg-base-300 flex flex-wrap gap-2 rounded-3xl p-4">
            {eligibleChains?.map((chain) => {
              const isSelected = rootState.selectedChains.includes(
                chain.chain_name
              );

              return (
                <Tooltip
                  tip={`Deploy on ${chain.name}`}
                  key={chain.chain_name}
                  position="top"
                >
                  <Button
                    ghost={true}
                    className="rounded-2xl hover:ring"
                    size="sm"
                    role="button"
                    color="primary"
                    outline={isSelected}
                    onClick={() => {
                      rootActions.toggleAdditionalChain(chain.chain_name);
                    }}
                  >
                    <Image
                      className="pointer-events-none -translate-x-2 rounded-full"
                      src={`${process.env.NEXT_PUBLIC_EXPLORER_URL}${chain.image}`}
                      width={24}
                      height={24}
                      alt={`${chain.name} logo`}
                    />
                    <span>{chain.name}</span>
                  </Button>
                </Tooltip>
              );
            })}
          </div>
        </FormControl>
        <button type="submit" ref={formSubmitRef} />
      </form>
      <Modal.Actions>
        <PrevButton onClick={rootActions.prevStep}>Token details</PrevButton>
        <NextButton
          loading={state.isDeploying && !hasTxError}
          disabled={state.isGasPriceQueryLoading || state.isGasPriceQueryError}
          onClick={() => formSubmitRef.current?.click()}
        >
          Deploy & register token{" "}
          {Boolean(state.gasFees?.length) &&
            `on ${state.gasFees?.length} chain${
              Number(state.gasFees?.length) > 1 ? "s" : ""
            }`}
        </NextButton>
      </Modal.Actions>
    </>
  );
};

export default Step3;
