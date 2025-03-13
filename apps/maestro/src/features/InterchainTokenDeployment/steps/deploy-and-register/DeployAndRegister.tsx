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
import { WriteContractData } from "wagmi/query";

import { DeployTokenResult } from "~/features/suiHooks/useDeployToken";
import { useTransactionsContainer } from "~/features/Transactions";
import { SUI_CHAIN_ID, useBalance, useChainId } from "~/lib/hooks";
import { handleTransactionResult } from "~/lib/transactions/handlers";
import { getNativeToken } from "~/lib/utils/getNativeToken";
import ChainPicker from "~/ui/compounds/ChainPicker";
import { NextButton } from "~/ui/compounds/MultiStepForm";
import { useDeployAndRegisterRemoteInterchainTokenMutation } from "../../hooks";
import { useInterchainTokenDeploymentStateContainer } from "../../InterchainTokenDeployment.state";
import { useStep2ChainSelectionState } from "./DeployAndRegister.state";
import { filterEligibleChains } from "~/lib/utils/chains";

export const Step2: FC = () => {
  const { state: rootState, actions: rootActions } =
    useInterchainTokenDeploymentStateContainer();

  const { state, actions } = useStep2ChainSelectionState();

  const chainId = useChainId();

  // Handle both EVM and VM chains
  const sourceChain = state.chains.find((chain) => chain.chain_id === chainId);

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

  const { writeAsync: deployInterchainTokenAsync, isReady } =
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
    async (ev) => {
      ev.preventDefault();

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
        step: 1,
        totalSteps: 1,
      });

      const txPromise = deployInterchainTokenAsync().catch((e) => {
        // Handle user rejection from any wallet
        if (e.message?.toLowerCase().includes("reject")) {
          toast.error("Transaction rejected by user");
          rootActions.setTxState({
            type: "idle",
          });
          return;
        }

        toast.error(e.message);
        rootActions.setTxState({
          type: "idle",
        });

        return;
      });

      // Sui will return a digest equivalent to the txHash
      if (sourceChain.chain_id === SUI_CHAIN_ID) {
        try {
          const result = (await txPromise) as DeployTokenResult;
          // if tx is successful, we will get a digest
          if (result) {
            rootActions.setTxState({
              type: "deployed",
              suiTx: result,
              txHash: result.digest,
              tokenAddress: result.tokenAddress,
            });
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
        } catch (e: any) {
          // We're catching the error above
          console.log("error in sui tx", e?.message);
        }
      }

      await handleTransactionResult(txPromise as Promise<WriteContractData>, {
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
      });
    },
    [
      rootState,
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

  const eligibleChains = filterEligibleChains(state.chains, chainId);

  const formSubmitRef = useRef<ComponentRef<"button">>(null);

  const balance = useBalance();

  // TODO: Fetch it from the axelarscan chains API
  const nativeTokenSymbol = state.sourceChainId
    ? getNativeToken(state.sourceChainId)
    : undefined;

  const hasInsufficientGasBalance = useMemo(() => {
    if (!balance || !state.remoteDeploymentGasFees) {
      return false;
    }

    const gasFeeBn = parseUnits(state.totalGasFee, balance.decimals);

    return gasFeeBn > balance.value;
  }, [balance, state.remoteDeploymentGasFees, state.totalGasFee]);

  const { children: buttonChildren, status: buttonStatus } = useMemo(() => {
    if (rootState.txState.type === "pending_approval") {
      if (rootState.txState.step && rootState.txState.totalSteps) {
        return {
          children: `Check your wallet - Signature ${rootState.txState.step}/${rootState.txState.totalSteps}`,
          status: "loading",
        };
      }
      return { children: "Check your wallet", status: "loading" };
    }
    if (rootState.txState.type === "idle" && !isReady) { 
      return { children: "Initializing", status: "loading" };
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
    isReady,
    rootState.txState,
    state.isEstimatingGasFees,
    state.hasGasFeesEstimationError,
    state.totalGasFee,
    hasInsufficientGasBalance,
    validDestinationChainIds.length,
    sourceChain?.native_token.decimals,
    nativeTokenSymbol,
  ]);

  if (!sourceChain) {
    return;
  }

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
              buttonStatus === "loading" ||
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
