import { Dialog, FormControl, Label, Tooltip } from "@axelarjs/ui";
import { toast } from "@axelarjs/ui/toaster";
import { invariant, Maybe } from "@axelarjs/utils";
import React, {
  useCallback,
  useMemo,
  useRef,
  type FC,
  type FormEventHandler,
} from "react";

import { parseUnits } from "viem";
import { useAccount, useBalance, useChainId } from "wagmi";

import { useTransactionsContainer } from "~/features/Transactions";
import { handleTransactionResult } from "~/lib/transactions/handlers";
import { getNativeToken } from "~/lib/utils/getNativeToken";
import ChainPicker from "~/ui/compounds/ChainPicker";
import { NextButton } from "~/ui/compounds/MultiStepForm";
import { useDeployAndRegisterRemoteInterchainTokenMutation } from "../../hooks";
import { useInterchainTokenDeploymentStateContainer } from "../../InterchainTokenDeployment.state";
import { useStep3ChainSelectionState } from "./DeployAndRegister.state";

export const Step3: FC = () => {
  const { state: rootState, actions: rootActions } =
    useInterchainTokenDeploymentStateContainer();

  const { state, actions } = useStep3ChainSelectionState();

  const chainId = useChainId();

  const sourceChain = state.evmChains.find((x) => x.chain_id === chainId);

  const { writeAsync: deployInterchainTokenAsync } =
    useDeployAndRegisterRemoteInterchainTokenMutation(
      {
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
        salt: rootState.tokenDetails.salt as `0x${string}`,
        tokenName: rootState.tokenDetails.tokenName,
        tokenSymbol: rootState.tokenDetails.tokenSymbol,
        decimals: rootState.tokenDetails.tokenDecimals,
        destinationChainIds: Array.from(rootState.selectedChains),
        remoteDeploymentGasFees: state.remoteDeploymentGasFees ?? [],
        sourceChainId: sourceChain?.id ?? "",
        minterAddress: rootState.tokenDetails.minter,
        initialSupply: Maybe.of(
          rootState.tokenDetails.initialSupply
        ).mapOrUndefined(BigInt),
      }
    );

  const [, { addTransaction }] = useTransactionsContainer();

  const handleSubmit = useCallback<FormEventHandler<HTMLFormElement>>(
    async (e) => {
      e.preventDefault();

      if (
        state.isEstimatingGasFees ||
        state.hasGasFeesEstimationError ||
        !state.remoteDeploymentGasFees ||
        !state.evmChains ||
        !deployInterchainTokenAsync
      ) {
        console.warn("gas prices not loaded");
        return;
      }
      actions.setIsDeploying(true);

      invariant(sourceChain, "source chain not found");

      rootActions.setTxState({
        type: "pending_approval",
      });

      const txPromise = deployInterchainTokenAsync();

      await handleTransactionResult(txPromise, {
        onSuccess(tx) {
          rootActions.setTxState({
            type: "deploying",
            txHash: tx.hash,
          });

          addTransaction({
            status: "submitted",
            hash: tx.hash,
            chainId: sourceChain.chain_id,
          });
        },
        onTransactionError(txError) {
          rootActions.setTxState({
            type: "idle",
          });

          toast.error(txError.shortMessage);
        },
      });
    },
    [
      state.isEstimatingGasFees,
      state.hasGasFeesEstimationError,
      state.remoteDeploymentGasFees,
      state.evmChains,
      deployInterchainTokenAsync,
      actions,
      sourceChain,
      rootActions,
      addTransaction,
    ]
  );

  const eligibleChains = useMemo(
    () => state.evmChains?.filter((chain) => chain.chain_id !== chainId),
    [state.evmChains, chainId]
  );

  const formSubmitRef = useRef<HTMLButtonElement>(null);

  const { address } = useAccount();

  const { data: balance } = useBalance({
    address,
    watch: true,
  });

  const nativeTokenSymbol = getNativeToken(state.sourceChainId);

  const hasInsufficientGasBalance = useMemo(() => {
    if (!balance || !state.remoteDeploymentGasFees) {
      return false;
    }

    const gasFeeBn = parseUnits(state.totalGasFee, balance.decimals);

    return gasFeeBn > balance.value;
  }, [balance, state.remoteDeploymentGasFees, state.totalGasFee]);

  const buttonChildren = useMemo(() => {
    if (rootState.txState.type === "pending_approval") {
      return "Check your wallet";
    }
    if (rootState.txState.type === "deploying") {
      return "Deploying interchain token";
    }

    if (state.isEstimatingGasFees) {
      return "Loading gas fees";
    }
    if (state.hasGasFeesEstimationError) {
      return "Failed to load gas prices";
    }

    if (hasInsufficientGasBalance) {
      return `Insufficient ${nativeTokenSymbol} for gas fees`;
    }

    return (
      <>
        Deploy{" "}
        {Maybe.of(state.remoteDeploymentGasFees?.length).mapOrNull((length) => (
          <>{` on ${length + 1} chain${length + 1 > 1 ? "s" : ""}`}</>
        ))}
      </>
    );
  }, [
    rootState.txState.type,
    state.isEstimatingGasFees,
    state.hasGasFeesEstimationError,
    state.remoteDeploymentGasFees,
    hasInsufficientGasBalance,
    nativeTokenSymbol,
  ]);

  return (
    <>
      <form onSubmit={handleSubmit}>
        <FormControl>
          <Label>
            <Label.Text>Additional chains (optional):</Label.Text>

            {Boolean(state.remoteDeploymentGasFees?.length) && (
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
            disabled={
              rootState.txState.type === "pending_approval" ||
              rootState.txState.type === "deploying"
            }
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
            state.isEstimatingGasFees ||
            state.hasGasFeesEstimationError ||
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
