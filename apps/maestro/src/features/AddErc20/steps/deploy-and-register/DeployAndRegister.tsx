import type { EVMChainConfig } from "@axelarjs/api";
import { Button, Dialog, FormControl, Label, Tooltip } from "@axelarjs/ui";
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
import { parseUnits } from "viem";
import { useAccount, useBalance } from "wagmi";

import { useAddErc20StateContainer } from "~/features/AddErc20/AddErc20.state";
import { useDeployAndRegisterRemoteStandardizedTokenMutation } from "~/features/AddErc20/hooks/useDeployAndRegisterRemoteStandardizedTokenMutation";
import { getNativeToken } from "~/lib/utils/getNativeToken";
import { NextButton } from "../shared";
import { useStep3ChainSelectionState } from "./DeployAndRegister.state";

const ChainPicker: FC<{
  eligibleChains: EVMChainConfig[];
  selectedChains: string[];
  onChainClick: (chainId: string) => void;
}> = ({ eligibleChains, selectedChains, onChainClick }) => {
  const handleToggleAll = useCallback(() => {
    eligibleChains.forEach((chain, i) =>
      setTimeout(onChainClick.bind(null, chain.id), 16.6 * i)
    );
  }, [eligibleChains, onChainClick]);

  const isToggleAllDisabled = useMemo(
    () =>
      Boolean(
        selectedChains.length && selectedChains.length !== eligibleChains.length
      ),
    [selectedChains, eligibleChains]
  );

  return (
    <section className="space-y-4">
      <div className="bg-base-300 grid grid-cols-2 justify-start gap-1.5 rounded-3xl p-2.5 sm:grid-cols-3 sm:gap-2">
        {eligibleChains?.map((chain) => {
          const isSelected = selectedChains.includes(chain.id);

          return (
            <Tooltip
              tip={`Deploy on ${chain.name}`}
              key={chain.chain_name}
              position="top"
            >
              <Button
                className="w-full rounded-2xl hover:ring"
                size="sm"
                role="button"
                variant={isSelected ? "success" : undefined}
                onClick={onChainClick.bind(null, chain.id)}
              >
                <Image
                  className="pointer-events-none absolute left-3 -translate-x-2 rounded-full"
                  src={`${process.env.NEXT_PUBLIC_EXPLORER_URL}${chain.image}`}
                  width={24}
                  height={24}
                  alt={`${chain.name} logo`}
                />
                <span className="ml-4">{chain.name}</span>
              </Button>
            </Tooltip>
          );
        })}
      </div>
      <div className="grid place-content-center">
        <Button
          size="sm"
          variant="ghost"
          disabled={isToggleAllDisabled}
          onClick={handleToggleAll}
        >
          toggle all
        </Button>
      </div>
    </section>
  );
};

export const Step3: FC = () => {
  const { state: rootState, actions: rootActions } =
    useAddErc20StateContainer();

  const { state, actions } = useStep3ChainSelectionState();

  const totalGasFees = useMemo(
    () =>
      (state.gasFees ?? []).reduce((acc, gasFee) => acc + gasFee, BigInt(0)),
    [state.gasFees]
  );

  const sourceChain = state.evmChains.find(
    propEq("chain_id", state.network.chain?.id)
  );

  const { writeAsync: deployInterchainTokenAsync } =
    useDeployAndRegisterRemoteStandardizedTokenMutation(
      {
        salt: rootState.tokenDetails.salt,
        value: totalGasFees,
        onStatusUpdate(txState) {
          if (txState.type === "deployed") {
            rootActions.setTxState(txState);
            rootActions.setStep(2);
            actions.setIsDeploying(false);
            return;
          }
          rootActions.setTxState(txState);
        },
      },
      {
        tokenName: rootState.tokenDetails.tokenName,
        tokenSymbol: rootState.tokenDetails.tokenSymbol,
        decimals: rootState.tokenDetails.tokenDecimals,
        destinationChainIds: Array.from(rootState.selectedChains),
        gasFees: state.gasFees ?? [],
        sourceChainId: sourceChain?.chain_name ?? "",
        initialSupply: BigInt(rootState.tokenDetails.tokenCap),
        deployerAddress: rootState.tokenDetails.distributor,
      }
    );

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

      rootActions.setTxState({
        type: "pending_approval",
      });

      const tx = await deployInterchainTokenAsync?.();

      if (tx?.hash) {
        rootActions.setTxState({
          type: "deploying",
          txHash: tx.hash,
        });
      }
    },
    [
      state.isGasPriceQueryLoading,
      state.isGasPriceQueryError,
      state.gasFees,
      state.evmChains,
      state.network.chain?.id,
      actions,
      rootActions,
      deployInterchainTokenAsync,
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

  const { address } = useAccount();

  const { data: balance } = useBalance({
    address,
  });

  const nativeTokenSymbol = getNativeToken(state.sourceChainId);

  const hasInsufficientGasBalance = useMemo(() => {
    if (!balance || !state.gasFees) {
      return false;
    }

    const gasFeeBn = parseUnits(state.totalGasFee, balance.decimals);

    return gasFeeBn > balance.value;
  }, [balance, state.gasFees, state.totalGasFee]);

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

    if (hasInsufficientGasBalance) {
      return `Insufficient ${nativeTokenSymbol} for gas fees`;
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
    rootState.txState.type,
    state.isGasPriceQueryLoading,
    state.isGasPriceQueryError,
    state.gasFees,
    hasInsufficientGasBalance,
    nativeTokenSymbol,
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
                    {state?.sourceChainId && nativeTokenSymbol} in fees)
                  </span>
                </Tooltip>
              </Label.AltText>
            )}
          </Label>
          <ChainPicker
            eligibleChains={eligibleChains}
            selectedChains={rootState.selectedChains}
            onChainClick={rootActions.toggleAdditionalChain}
          />
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
          disabled={
            state.isGasPriceQueryLoading ||
            state.isGasPriceQueryError ||
            hasInsufficientGasBalance
          }
          onClick={() => formSubmitRef.current?.click()}
        >
          <span>{buttonChildren}</span>
        </NextButton>
      </Dialog.Actions>
    </>
  );
};

export default Step3;
