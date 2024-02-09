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

  const validDestinationChains = useMemo(
    () =>
      state.remoteDeploymentGasFees?.gasFees
        .filter((x) => x.status === "success")
        .map((x) => x.destinationChainId) ?? [],
    [state.remoteDeploymentGasFees?.gasFees]
  );

  const { writeAsync: deployInterchainTokenAsync } =
    useDeployAndRegisterRemoteInterchainTokenMutation(
      {
        onStatusUpdate(txState) {
          if (txState.type === "deployed") {
            rootActions.setTxState(txState);
            rootActions.setStep(3);
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
        destinationChainIds: validDestinationChains,
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

      await handleTransactionResult(txPromise, {
        onSuccess(tx) {
          rootActions.setTxState({
            type: "deploying",
            txHash: tx.hash,
          });

          if (rootState.selectedChains.length > 0) {
            addTransaction({
              status: "submitted",
              hash: tx.hash,
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
          {Maybe.of(validDestinationChains.length).mapOrNull((length) => (
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
    validDestinationChains.length,
    sourceChain?.native_token.decimals,
    nativeTokenSymbol,
  ]);

  const isCTADisabled =
    state.isEstimatingGasFees ||
    state.hasGasFeesEstimationError ||
    hasInsufficientGasBalance ||
    rootState.txState.type === "pending_approval";

  const erroredChainIds = useMemo(() => {
    const failed = state.remoteDeploymentGasFees?.gasFees.filter(
      (x) => x.status === "error"
    );

    return failed?.map((x) => x.destinationChainId) ?? [];
  }, [state.remoteDeploymentGasFees]);

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
            erroredChains={erroredChainIds}
            loading={state.isEstimatingGasFees}
          />
        </FormControl>
        <button type="submit" ref={formSubmitRef} />
      </form>
      <Dialog.Actions>
        {buttonStatus === "error" ? (
          <Alert status="error">{buttonChildren}</Alert>
        ) : (
          <NextButton
            length="block"
            loading={
              rootState.txState.type === "pending_approval" ||
              rootState.txState.type === "deploying"
            }
            disabled={isCTADisabled}
            onClick={() => {
              formSubmitRef.current?.click();
            }}
          >
            {buttonChildren}
          </NextButton>
        )}
      </Dialog.Actions>
    </>
  );
};

export default Step3;
