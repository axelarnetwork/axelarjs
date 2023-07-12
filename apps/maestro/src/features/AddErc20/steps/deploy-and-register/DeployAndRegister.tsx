import {
  Button,
  Dialog,
  FormControl,
  Label,
  toast,
  Tooltip,
} from "@axelarjs/ui";
import { invariant } from "@axelarjs/utils";
import React, {
  useCallback,
  useMemo,
  useRef,
  type FC,
  type FormEventHandler,
} from "react";
import Image from "next/image";

import { propEq } from "rambda";

import { useAddErc20StateContainer } from "~/features/AddErc20/AddErc20.state";
import { useDeployInterchainTokenMutation } from "~/features/AddErc20/hooks/useDeployInterchainTokenMutation";
import { getNativeToken } from "~/lib/utils/getNativeToken";
import { NextButton } from "../shared";
import { useStep3ChainSelectionState } from "./DeployAndRegister.state";

export const Step3: FC = () => {
  const { state: rootState, actions: rootActions } =
    useAddErc20StateContainer();

  const { state, actions } = useStep3ChainSelectionState();

  const { mutateAsync: deployInterchainTokenAsync } =
    useDeployInterchainTokenMutation({
      value: state.gasFees?.length
        ? state.gasFees.reduce((acc, gasFee) => acc + gasFee)
        : BigInt(0),
      onStatusUpdate(txState) {
        if (txState.type === "deployed") {
          rootActions.setTxState(txState);
          rootActions.setStep(2);
          actions.setIsDeploying(false);
          return;
        }
        rootActions.setTxState(txState);
      },
    });

  const handleSubmit = useCallback<FormEventHandler<HTMLFormElement>>(
    async (e) => {
      e.preventDefault();

      if (
        state.isGasPriceQueryLoading ||
        state.isGasPriceQueryError ||
        !state.gasFees ||
        !state.evmChains
      ) {
        console.warn("gas prices not loaded");
        return;
      }
      actions.setIsDeploying(true);

      const sourceChain = state.evmChains.find(
        propEq("chain_id", state.network.chain?.id)
      );

      invariant(sourceChain, "source chain not found");

      await deployInterchainTokenAsync(
        {
          tokenName: rootState.tokenDetails.tokenName,
          tokenSymbol: rootState.tokenDetails.tokenSymbol,
          decimals: rootState.tokenDetails.tokenDecimals,
          destinationChainIds: Array.from(rootState.selectedChains),
          gasFees: state.gasFees,
          sourceChainId: sourceChain.chain_name,
          cap: BigInt(rootState.tokenDetails.tokenCap),
          mintTo: rootState.tokenDetails.mintTo,
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
      deployInterchainTokenAsync,
      rootState.tokenDetails.tokenName,
      rootState.tokenDetails.tokenSymbol,
      rootState.tokenDetails.tokenDecimals,
      rootState.tokenDetails.tokenCap,
      rootState.tokenDetails.mintTo,
      rootState.selectedChains,
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

  const buttonChildren = useMemo(() => {
    if (rootState.txState.type === "pending_approval") {
      return "Check your wallet";
    }
    if (rootState.txState.type === "deploying") {
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
        {!!state.gasFees?.length && (
          <>
            {state.gasFees?.length && <span>and register</span>}
            {` on ${state.gasFees.length + 1} chain${
              state.gasFees?.length + 1 > 1 ? "s" : ""
            }`}
          </>
        )}
      </>
    );
  }, [
    state.gasFees?.length,
    state.isGasPriceQueryError,
    state.isGasPriceQueryLoading,
    rootState.txState,
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
                    variant={isSelected ? "success" : undefined}
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
          loading={
            rootState.txState.type === "pending_approval" ||
            rootState.txState.type === "deploying"
          }
          disabled={state.isGasPriceQueryLoading || state.isGasPriceQueryError}
          onClick={() => formSubmitRef.current?.click()}
        >
          <span>{buttonChildren}</span>
        </NextButton>
      </Dialog.Actions>
    </>
  );
};

export default Step3;
