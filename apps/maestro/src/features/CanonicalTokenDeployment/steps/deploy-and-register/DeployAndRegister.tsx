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

import { useCanonicalTokenDeploymentStateContainer } from "~/features/CanonicalTokenDeployment/CanonicalTokenDeployment.state";
import { useDeployAndRegisterRemoteCanonicalTokenMutation } from "~/features/CanonicalTokenDeployment/hooks";
import { RegisterCanonicalTokenResult } from "~/features/suiHooks/useRegisterCanonicalToken";
import { useTransactionsContainer } from "~/features/Transactions";
import {
  STELLAR_CHAIN_ID,
  SUI_CHAIN_ID,
  useBalance,
  useChainId,
} from "~/lib/hooks";
import { handleTransactionResult } from "~/lib/transactions/handlers";
import { filterEligibleChains } from "~/lib/utils/chains";
import { getNativeToken } from "~/lib/utils/getNativeToken";
import ChainPicker from "~/ui/compounds/ChainPicker";
import { NextButton, TokenNameAlert } from "~/ui/compounds/MultiStepForm";
import { useStep3ChainSelectionState } from "./DeployAndRegister.state";

export const Step3: FC = () => {
  const { state: rootState, actions: rootActions } =
    useCanonicalTokenDeploymentStateContainer();

  const { state, actions } = useStep3ChainSelectionState();

  const chainId = useChainId();

  // Support both EVM and VM chains
  const sourceChain = state.chains?.find((chain) => chain.chain_id === chainId);

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

  // Hook for deploying canonical tokens

  const { writeAsync: deployCanonicalTokenAsync } =
    useDeployAndRegisterRemoteCanonicalTokenMutation(
      {
        onStatusUpdate(txState) {
          if (txState.type === "deployed") {
            rootActions.setTxState(txState);
            rootActions.setSelectedChains(validDestinationChainIds);
            actions.setIsDeploying(false);
            rootActions.setStep(2);
            return;
          }
          rootActions.setTxState(txState);
        },
      },
      {
        tokenAddress: rootState.tokenDetails.tokenAddress,
        tokenName: rootState.tokenDetails.tokenName,
        tokenSymbol: rootState.tokenDetails.tokenSymbol,
        decimals: rootState.tokenDetails.tokenDecimals,
        destinationChainIds: validDestinationChainIds,
        remoteDeploymentGasFees:
          state.remoteDeploymentGasFees?.gasFees.map((x) => x.fee) ?? [],
        sourceChainId: sourceChain?.id ?? "",
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

      if (
        (!deployCanonicalTokenAsync &&
          sourceChain?.chain_id !== STELLAR_CHAIN_ID) ||
        !hasGasfees
      ) {
        console.warn("gas prices not loaded");
        return;
      }
      actions.setIsDeploying(true);

      invariant(sourceChain, "source chain not found");

      rootActions.setTxState({
        type: "pending_approval",
      });

      const txPromise = deployCanonicalTokenAsync().catch((e) => {
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
          const result = (await txPromise) as RegisterCanonicalTokenResult;
          // if tx is successful, we will get a digest
          if (result) {
            rootActions.setTxState({
              type: "deployed",
              suiTx: result,
              tokenAddress: rootState.tokenDetails.tokenAddress,
              txHash: result.digest,
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
          toast.error(e.message);
          rootActions.setTxState({
            type: "idle",
          });
        }
      }

      // Handle Stellar token deployment
      if (sourceChain.chain_id === STELLAR_CHAIN_ID) {
        try {
          const result = (await txPromise) as RegisterCanonicalTokenResult;
          if (result) {
            if (rootState.selectedChains.length > 0) {
              addTransaction({
                status: "submitted",
                hash: result.digest,
                chainId: sourceChain.chain_id,
                txType: "INTERCHAIN_DEPLOYMENT",
              });
              return;
            }
          } else {
            rootActions.setTxState({
              type: "idle",
            });
            throw new Error("Stellar deployment result incomplete.");
          }
        } catch (e: any) {
          console.log("errorror", e);
          toast.error(e.message || "Stellar deployment failed");
          rootActions.setTxState({
            type: "idle",
          });
        }
        return;
      }

      // For EVM chains, handle the transaction result
      if (txPromise) {
        try {
          await handleTransactionResult(
            txPromise as Promise<WriteContractData>,
            {
              onSuccess(txHash) {
                rootActions.setTxState({
                  type: "deploying",
                  txHash: txHash,
                });

                if (validDestinationChainIds.length > 0) {
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
            }
          );
        } catch (e: any) {
          toast.error(e.message);
          rootActions.setTxState({
            type: "idle",
          });
        }
      }
    },
    [
      rootState.selectedChains.length,
      state.totalGasFee,
      state.isEstimatingGasFees,
      state.hasGasFeesEstimationError,
      deployCanonicalTokenAsync,
      actions,
      sourceChain,
      rootActions,
      validDestinationChainIds,
      rootState.tokenDetails.tokenAddress,
      addTransaction,
    ]
  );

  const eligibleChains = filterEligibleChains(state.chains, chainId);

  const formSubmitRef = useRef<ComponentRef<"button">>(null);

  const balance = useBalance();

  const nativeTokenSymbol = useMemo(() => {
    if (sourceChain?.chain_type === "vm") {
      return sourceChain.native_token.symbol;
    }
    return getNativeToken(state.sourceChainId);
  }, [sourceChain, state.sourceChainId]);

  const hasInsufficientGasBalance = useMemo(() => {
    if (!balance || !state.remoteDeploymentGasFees) {
      return false;
    }

    const gasFeeBn = parseUnits(state.totalGasFee, balance.decimals);

    return gasFeeBn > balance.value;
  }, [balance, state.remoteDeploymentGasFees, state.totalGasFee]);

  const { children: buttonChildren, status: buttonStatus } = useMemo(() => {
    if (rootState.txState.type === "pending_approval") {
      return { children: "Check your wallet", status: "loading" as const };
    }
    if (rootState.txState.type === "deploying") {
      return {
        children: "Deploying interchain token",
        status: "loading" as const,
      };
    }

    if (state.isEstimatingGasFees) {
      return { children: "Estimating gas fees", status: "loading" as const };
    }

    if (state.hasGasFeesEstimationError) {
      return {
        children: "Failed to load gas prices",
        status: "error" as const,
      };
    }

    if (hasInsufficientGasBalance) {
      return {
        children: `Insufficient ${nativeTokenSymbol} for gas fees`,
        status: "error" as const,
      };
    }

    return {
      children: (
        <>
          Register{" "}
          {Maybe.of(validDestinationChainIds.length).mapOrNull((length) => (
            <>
              {length > 0 && <span>& deploy</span>}
              {` on ${length + 1} chain${length + 1 > 1 ? "s" : ""}`}
            </>
          ))}
        </>
      ),
      status: "idle" as const,
    };
  }, [
    rootState.txState.type,
    state.isEstimatingGasFees,
    state.hasGasFeesEstimationError,
    hasInsufficientGasBalance,
    validDestinationChainIds.length,
    nativeTokenSymbol,
  ]);

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
      <TokenNameAlert />
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
            disabled={
              state.isEstimatingGasFees ||
              state.hasGasFeesEstimationError ||
              hasInsufficientGasBalance
            }
            onClick={() => formSubmitRef.current?.click()}
          >
            <p className="text-indigo-600">{buttonChildren}</p>
          </NextButton>
        )}
      </Dialog.Actions>
    </>
  );
};

export default Step3;
