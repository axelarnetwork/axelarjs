import toast from "@axelarjs/ui/toaster";
import { invariant, Maybe } from "@axelarjs/utils";
import { FormEventHandler, useCallback, useMemo } from "react";

import { parseUnits } from "viem";
import { WriteContractData } from "wagmi/query";

import { STELLAR_CHAIN_ID, SUI_CHAIN_ID } from "~/config/chains";
import { useChainId } from "~/lib/hooks";
import { handleTransactionResult } from "../../../../lib/transactions/handlers";
import { DeployTokenResultStellar } from "../../../stellarHooks";
import { DeployTokenResult } from "../../../suiHooks/useDeployToken";
import { useTransactionsContainer } from "../../../Transactions";
import { useDeployAndRegisterRemoteInterchainTokenMutation } from "../../hooks";
import { useInterchainTokenDeploymentStateContainer } from "../../InterchainTokenDeployment.state";
import { useStep2ChainSelectionState } from "./DeployAndRegister.state";

export const useDestinationChainIds = () => {
  const { state } = useStep2ChainSelectionState();

  return useMemo(
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
};

export const useHandleSubmit = () => {
  const { state: rootState, actions: rootActions } =
    useInterchainTokenDeploymentStateContainer();

  const { state, actions } = useStep2ChainSelectionState();

  const chainId = useChainId();

  const sourceChain = state.chains.find((chain) => chain.chain_id === chainId);

  const [, { addTransaction }] = useTransactionsContainer();

  const [validDestinationChainIds] = useDestinationChainIds();

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
          toast.error("Transaction rejected by user.");
          rootActions.setTxState({
            type: "idle",
          });
          actions.setIsDeploying(false);
          return;
        }

        toast.error(e.message);
        rootActions.setTxState({
          type: "idle",
        });
        actions.setIsDeploying(false);

        return;
      });

      if (sourceChain.chain_id === STELLAR_CHAIN_ID) {
        try {
          const result = (await txPromise) as DeployTokenResultStellar;
          if (result && result.hash && result.tokenAddress) {
            if (rootState.selectedChains.length >= 0) {
              addTransaction({
                status: "submitted",
                hash: result.hash,
                chainId: sourceChain.chain_id,
                txType: "INTERCHAIN_DEPLOYMENT",
              });
            }
            return;
          } else {
            rootActions.setTxState({
              type: "idle",
            });
            throw new Error("Stellar deployment result incomplete.");
          }
        } catch (e: any) {
          console.error(
            "Stellar deployment error in DeployAndRegister.tsx:",
            e
          );
          toast.error(e.message || "Stellar deployment failed.");
          rootActions.setTxState({
            type: "idle",
          });
          actions.setIsDeploying(false);
        }
        return;
      }

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
            actions.setIsDeploying(false);
            return;
          } else {
            rootActions.setTxState({
              type: "idle",
            });
            actions.setIsDeploying(false);
            return;
          }
        } catch (e: any) {
          toast.error(e.message);
          rootActions.setTxState({
            type: "idle",
          });
          actions.setIsDeploying(false);
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

  return { handleSubmit, isReady };
};

export interface UseButtonChildrenProps {
  hasInsufficientGasBalance: boolean;
  nativeTokenSymbol: string | undefined;
  isReady: boolean;
}

export const useButtonChildren = ({
  hasInsufficientGasBalance,
  nativeTokenSymbol,
  isReady,
}: UseButtonChildrenProps) => {
  const { state: rootState } = useInterchainTokenDeploymentStateContainer();

  const { state } = useStep2ChainSelectionState();

  const [validDestinationChainIds] = useDestinationChainIds();

  const chainId = useChainId();

  const sourceChain = state.chains.find((chain) => chain.chain_id === chainId);

  return useMemo(() => {
    if (rootState.txState.type === "pending_approval") {
      if (rootState.txState.step && rootState.txState.totalSteps) {
        return {
          children: `Check your wallet - Signature ${rootState.txState.step}/${rootState.txState.totalSteps}`,
          status: "loading",
        };
      }
      return { children: "Check your wallet", status: "loading" };
    }

    // After Sui success, txState is set to "deployed" but step advances after DB recording.
    // Keep loading state until step transitions to "review".
    if (rootState.txState.type === "deployed" && rootState.step < 2) {
      return { children: "Finalizing deployment", status: "loading" };
    }

    // Keep loading state visible while deployment is in progress
    if (state.isDeploying) {
      return { children: "Deploying interchain token", status: "loading" };
    }

    if (state.isEstimatingGasFees) {
      return { children: "Loading gas fees", status: "loading" };
    }

    if (hasInsufficientGasBalance) {
      return {
        children: sourceChain?.native_token.decimals
          ? `Insufficient ${nativeTokenSymbol} balance for gas fees (${state.totalGasFee})`
          : `Insufficient ${nativeTokenSymbol} balance for gas fees`,
        status: "error",
      };
    }

    if (state.hasGasFeesEstimationError) {
      return {
        children: "Failed to load gas prices",
        status: "error",
      };
    }

    if (rootState.txState.type === "idle" && !isReady) {
      return { children: "Initializing", status: "loading" };
    }

    if (rootState.txState.type === "deploying") {
      return { children: "Deploying interchain token", status: "loading" };
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
    rootState.step,
    state.isEstimatingGasFees,
    state.hasGasFeesEstimationError,
    state.totalGasFee,
    hasInsufficientGasBalance,
    validDestinationChainIds.length,
    sourceChain?.native_token.decimals,
    nativeTokenSymbol,
    state.isDeploying,
  ]);
};
