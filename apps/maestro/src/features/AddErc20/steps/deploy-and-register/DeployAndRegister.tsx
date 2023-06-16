import {
  Button,
  Dialog,
  FormControl,
  Label,
  toast,
  Tooltip,
} from "@axelarjs/ui";
import React, {
  useCallback,
  useMemo,
  useRef,
  type FC,
  type FormEventHandler,
} from "react";
import Image from "next/image";

import clsx from "clsx";

import { useAddErc20StateContainer } from "~/features/AddErc20/AddErc20.state";
import { useDeployInterchainTokenMutation } from "~/features/AddErc20/hooks/useDeployInterchainTokenMutation";
import { NextButton } from "~/features/AddErc20/steps/shared";
import { getNativeToken } from "~/lib/utils/getNativeToken";
import { useStep3ChainSelectionState } from "./DeployAndRegister.state";

export const Step3: FC = () => {
  const { state: rootState, actions: rootActions } =
    useAddErc20StateContainer();

  const { state, actions } = useStep3ChainSelectionState();

  const {
    mutateAsync: deployInterchainToken,
    error: deployInterchainTokenError,
  } = useDeployInterchainTokenMutation({
    value: BigInt(0),
    onStatusUpdate(txState) {
      if (txState.type === "deploying") {
        rootActions.setTxState(txState);
      }
      if (txState.type === "deployed") {
        rootActions.setTxState(txState);
        rootActions.nextStep();
        actions.setIsDeploying(false);
      }
    },
  });

  const handleSubmit = useCallback<FormEventHandler<HTMLFormElement>>(
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

      await deployInterchainToken(
        {
          tokenName: rootState.tokenDetails.tokenName,
          tokenSymbol: rootState.tokenDetails.tokenSymbol,
          decimals: rootState.tokenDetails.tokenDecimals,
          destinationChainIds: Array.from(rootState.selectedChains),
          gasFees: state.gasFees,
          sourceChainId: state.evmChains?.find(
            (evmChain) => evmChain.chain_id === state.network.chain?.id
          )?.chain_name as string,
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
      rootState.tokenDetails.tokenName,
      rootState.tokenDetails.tokenSymbol,
      rootState.selectedChains,
      deployInterchainToken,
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

  const hasTxError = Boolean(deployInterchainTokenError);

  const buttonChildren = useMemo(() => {
    if (state.isDeploying) {
      return "Deploying interchain token";
    }
    if (state.isGasPriceQueryLoading) {
      return "Loading gas fees";
    }
    if (state.isGasPriceQueryError) {
      return "Failed to load gas prices";
    }
    return (
      <>
        Deploy{" "}
        {Boolean(state.gasFees?.length) && (
          <>
            {state.gasFees?.length && <span>and register</span>}
            {` on ${state.gasFees?.length} chain${
              Number(state.gasFees?.length) > 1 ? "s" : ""
            }`}
          </>
        )}
      </>
    );
  }, [
    state.gasFees?.length,
    state.isDeploying,
    state.isGasPriceQueryError,
    state.isGasPriceQueryLoading,
  ]);

  return (
    <>
      <form onSubmit={handleSubmit}>
        <FormControl>
          <Label>
            <Label.Text>Additional chains (optional):</Label.Text>

            {Boolean(state.gasFees?.length) && (
              <Label.AltText>
                <Tooltip tip="Approximate gas cost">
                  <span className="ml-2 whitespace-nowrap text-xs">
                    (≈ {state.totalGasFee}{" "}
                    {state?.sourceChainId &&
                      getNativeToken(state.sourceChainId)}{" "}
                    in fees)
                  </span>
                </Tooltip>
              </Label.AltText>
            )}
          </Label>
          <div className="bg-base-300 grid grid-cols-2 justify-start gap-1.5 rounded-3xl p-2.5 sm:grid-cols-3 sm:gap-2">
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
                    className="relative w-full rounded-2xl hover:ring"
                    size="sm"
                    role="button"
                    variant={isSelected ? "success" : "neutral"}
                    outline={isSelected}
                    onClick={() => {
                      rootActions.toggleAdditionalChain(chain.chain_name);
                    }}
                  >
                    <Image
                      className="pointer-events-none absolute left-3 -translate-x-2 rounded-full"
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
      <Dialog.Actions>
        <NextButton
          length="block"
          loading={state.isDeploying && !hasTxError}
          disabled={state.isGasPriceQueryLoading || state.isGasPriceQueryError}
          onClick={() => formSubmitRef.current?.click()}
        >
          <span
            className={clsx({
              "hidden md:inline": state.isDeploying,
            })}
          >
            {buttonChildren}
          </span>
        </NextButton>
      </Dialog.Actions>
    </>
  );
};

export default Step3;
