import { Alert, Dialog, FormControl, Label, Tooltip } from "@axelarjs/ui";
import { toast } from "@axelarjs/ui/toaster";
import { invariant, Maybe } from "@axelarjs/utils";
import React, {
  ComponentRef,
  useCallback,
  useMemo,
  useRef,
  type FC,
  type FormEventHandler,
} from "react";

import { parseUnits } from "viem";

import { NEXT_PUBLIC_NETWORK_ENV } from "~/config/env";
import { useTransactionsContainer } from "~/features/Transactions";
import { useBalance, useChainId } from "~/lib/hooks";
import { handleTransactionResult } from "~/lib/transactions/handlers";
import { getNativeToken } from "~/lib/utils/getNativeToken";
import ChainPicker from "~/ui/compounds/ChainPicker";
import { NextButton } from "~/ui/compounds/MultiStepForm";
import { useDeployAndRegisterRemoteInterchainTokenMutation } from "../../hooks";
import { useInterchainTokenDeploymentStateContainer } from "../../InterchainTokenDeployment.state";
import { useStep2ChainSelectionState } from "./DeployAndRegister.state";

export const Step2: FC = () => {
  const { state: rootState, actions: rootActions } =
    useInterchainTokenDeploymentStateContainer();

  const { state, actions } = useStep2ChainSelectionState();

  const chainId = useChainId();

  const sourceChain = state.evmChains.find((x) => x.chain_id === chainId);

  const [validDestinationChainIds, erroredDestinationChainIds] = useMemo(
    () =>
      (state.remoteDeploymentGasFees?.gasFees ?? []).reduce(
        ([succeeded, errored], x): [string[], string[]] =>
          x.status === "success"
            ? [[...succeeded, x.destinationChainId], errored]
            : [succeeded, [...errored, x.destinationChainId]],
        [[], []] as [string[], string[]]
      ),
    [state.remoteDeploymentGasFees?.gasFees]
  );

  const { writeAsync: deployInterchainTokenAsync } =
    useDeployAndRegisterRemoteInterchainTokenMutation(
      {
        onStatusUpdate(txState) {
          if (txState.type === "deployed") {
            rootActions.setTxState(txState);
            rootActions.setSelectedChains(validDestinationChainIds);
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
        destinationChainIds: validDestinationChainIds,
        remoteDeploymentGasFees: state.remoteDeploymentGasFees,
        sourceChainId: sourceChain?.id ?? "",
        minterAddress: rootState.tokenDetails.minter,
        initialSupply: parseUnits(
          rootState.tokenDetails.initialSupply,
          rootState.tokenDetails.tokenDecimals || 0
        ),
      }
    );

  const [, { addTransaction }] = useTransactionsContainer();

  const handleSubmit = useCallback<FormEventHandler<HTMLFormElement>>(
    async (e) => {
      e.preventDefault();

      const hasGasfees =
        !rootState.selectedChains.length ||
        (state.totalGasFee &&
          !state.isEstimatingGasFees &&
          !state.hasGasFeesEstimationError);

      if (!deployInterchainTokenAsync || !hasGasfees) {
        console.warn("gas prices not loaded");
        return;
      }
      actions.setIsDeploying(true);

      invariant(sourceChain, "source chain not found");

      rootActions.setTxState({
        type: "pending_approval",
      });

      const txPromise = deployInterchainTokenAsync();
      console.log("rootState.selectedChains", rootState.selectedChains);

      // Sui will return a digest equivalent to the txHash
      const SUI_CHAIN_ID = NEXT_PUBLIC_NETWORK_ENV === "mainnet" ? 101 : 103;
      if (sourceChain.chain_id === SUI_CHAIN_ID) {
        const result = await txPromise;
        // if tx is successful, we will get a digest
        if (result?.digest) {
          console.log("IT IS SUI: txPromise", result);
          rootActions.setTxState({
            status: "submitted",
            suiTx: result,
            txHash: result.digest,
            chainId: sourceChain.chain_id,
          });
          console.log("rootState", rootState);
          if (rootState.selectedChains.length > 0) {
            addTransaction({
              status: "submitted",
              suiTx: result,
              hash: result.digest,
              chainId: sourceChain.chain_id,
              txType: "INTERCHAIN_DEPLOYMENT",
            });
          }
          return;
        } else {
          rootActions.setTxState({
            type: "idle",
          });
        }
      }

      await handleTransactionResult(txPromise, {
        onSuccess(txHash) {
          rootActions.setTxState({
            type: "deploying",
            txHash: txHash,
          });

          if (rootState.selectedChains.length > 0) {
            addTransaction({
              status: "submitted",
              hash: txHash,
              chainId: sourceChain.chain_id,
              txType: "INTERCHAIN_DEPLOYMENT",
            });
          }
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
      rootState.selectedChains.length,
      state.totalGasFee,
      state.isEstimatingGasFees,
      state.hasGasFeesEstimationError,
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

  const formSubmitRef = useRef<ComponentRef<"button">>(null);

  const balance = useBalance();

  const nativeTokenSymbol = getNativeToken(state.sourceChainId);

  const hasInsufficientGasBalance = useMemo(() => {
    if (!balance || !state.remoteDeploymentGasFees) {
      return false;
    }

    const gasFeeBn = parseUnits(state.totalGasFee, balance.decimals);

    return gasFeeBn > balance.value;
  }, [balance, state.remoteDeploymentGasFees, state.totalGasFee]);

  const { children: buttonChildren, status: buttonStatus } = useMemo(() => {
    if (rootState.txState.type === "pending_approval") {
      return { children: "Check your wallet", status: "loading" };
    }
    if (rootState.txState.type === "deploying") {
      return { children: "Deploying interchain token", status: "loading" };
    }

    if (state.isEstimatingGasFees) {
      return { children: "Loading gas fees", status: "loading" };
    }
    if (state.hasGasFeesEstimationError) {
      return {
        children: "Failed to load gas prices",
        status: "error",
      };
    }

    if (hasInsufficientGasBalance) {
      return {
        children: sourceChain?.native_token.decimals
          ? `Insufficient ${nativeTokenSymbol} balance for gas fees (${state.totalGasFee})`
          : `Insufficient ${nativeTokenSymbol} balance for gas fees`,
        status: "error",
      };
    }

    return {
      children: (
        <>
          Deploy{" "}
          {Maybe.of(validDestinationChainIds.length).mapOrNull((length) => (
            <>{` on ${length + 1} chain${length + 1 > 1 ? "s" : ""}`}</>
          ))}
        </>
      ),
      status: "idle",
    };
  }, [
    rootState.txState.type,
    state.isEstimatingGasFees,
    state.hasGasFeesEstimationError,
    state.totalGasFee,
    hasInsufficientGasBalance,
    validDestinationChainIds.length,
    sourceChain?.native_token.decimals,
    nativeTokenSymbol,
  ]);

  const isCTADisabled =
    state.isEstimatingGasFees ||
    state.hasGasFeesEstimationError ||
    hasInsufficientGasBalance ||
    rootState.txState.type === "pending_approval";

  return (
    <>
      <form onSubmit={handleSubmit}>
        <FormControl>
          <Label>
            <Label.Text>Additional chains (optional):</Label.Text>
            {Boolean(state.remoteDeploymentGasFees?.gasFees.length) && (
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
            erroredChains={erroredDestinationChainIds}
            loading={state.isEstimatingGasFees}
          />
        </FormControl>
        <button type="submit" ref={formSubmitRef} />
      </form>
      <Dialog.Actions>
        {buttonStatus === "error" ? (
          <Alert $status="error">{buttonChildren}</Alert>
        ) : (
          <NextButton
            $length="block"
            $loading={
              rootState.txState.type === "pending_approval" ||
              rootState.txState.type === "deploying"
            }
            disabled={isCTADisabled}
            onClick={() => {
              formSubmitRef.current?.click();
            }}
          >
            <p className="text-indigo-600">{buttonChildren}</p>
          </NextButton>
        )}
      </Dialog.Actions>
    </>
  );
};

export default Step2;
