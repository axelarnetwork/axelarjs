import { Alert, Dialog, FormControl, Label, Tooltip } from "@axelarjs/ui";
import { toast } from "@axelarjs/ui/toaster";
import { invariant, Maybe } from "@axelarjs/utils";
import {
  ComponentRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  type FC,
  type FormEventHandler,
} from "react";

import { parseUnits } from "viem";
import { WriteContractData } from "wagmi/query";

import {
  HEDERA_CHAIN_ID,
  STELLAR_CHAIN_ID,
  SUI_CHAIN_ID,
} from "~/config/chains";
import { useCanonicalTokenDeploymentStateContainer } from "~/features/CanonicalTokenDeployment/CanonicalTokenDeployment.state";
import { useDeployAndRegisterRemoteCanonicalTokenMutation } from "~/features/CanonicalTokenDeployment/hooks";
import { RegisterCanonicalTokenResult } from "~/features/suiHooks/useRegisterCanonicalToken";
import { useTransactionsContainer } from "~/features/Transactions";
import { useBalance, useChainId } from "~/lib/hooks";
import { handleTransactionResult } from "~/lib/transactions/handlers";
import { filterEligibleChains } from "~/lib/utils/chains";
import { getNativeToken } from "~/lib/utils/getNativeToken";
import ChainPicker from "~/ui/compounds/ChainPicker";
import { NextButton, TokenNameAlert } from "~/ui/compounds/MultiStepForm";
import { useStep3ChainSelectionState } from "./DeployAndRegister.state";

const SIMULATION_DISABLED_CHAIN_IDS = [
  SUI_CHAIN_ID,
  STELLAR_CHAIN_ID,
  HEDERA_CHAIN_ID,
];

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

  const { writeAsync: deployCanonicalTokenAsync, simulationError } =
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

  useEffect(() => {
    if (!simulationError) return;
    const err = simulationError as unknown as {
      shortMessage?: string;
      message?: string;
    };
    const msg = `${err.shortMessage ?? err.message ?? "Failed to prepare transaction"}`;
    toast.error(msg);
  }, [simulationError]);

  const handleSubmit = useCallback<FormEventHandler<HTMLFormElement>>(
    async (e) => {
      e.preventDefault();

      const hasGasfees =
        !rootState.selectedChains.length ||
        (state.totalGasFee &&
          !state.isEstimatingGasFees &&
          !state.hasGasFeesEstimationError);

      if (!deployCanonicalTokenAsync || !hasGasfees) {
        console.warn("gas prices not loaded");
        return;
      }

      actions.setIsDeploying(true);
      invariant(sourceChain, "source chain not found");
      rootActions.setTxState({ type: "pending_approval" });

      const txPromise = deployCanonicalTokenAsync().catch((e: any) => {
        if (e.message?.toLowerCase().includes("reject")) {
          toast.error("Transaction rejected by user");
          rootActions.setTxState({ type: "idle" });
          actions.setIsDeploying(false);
          return;
        }
        toast.error(String(e?.message ?? "Unknown error"));
        rootActions.setTxState({ type: "idle" });
        actions.setIsDeploying(false);
        return;
      });

      const handleSui = async () => {
        try {
          const result = (await txPromise) as RegisterCanonicalTokenResult;
          if (!result) {
            rootActions.setTxState({ type: "idle" });
            actions.setIsDeploying(false);
            return;
          }
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
        } catch (e: any) {
          toast.error(String(e?.message ?? "Unknown error"));
          rootActions.setTxState({ type: "idle" });
          actions.setIsDeploying(false);
        }
      };

      const handleStellar = async () => {
        try {
          const result = await txPromise;
          if (
            result &&
            typeof result === "object" &&
            "hash" in result &&
            "tokenAddress" in result
          ) {
            actions.setIsDeploying(false);
            if (rootState.selectedChains.length > 0) {
              addTransaction({
                status: "submitted",
                hash: result.hash,
                chainId: sourceChain.chain_id,
                txType: "INTERCHAIN_DEPLOYMENT",
              });
            }
          } else {
            throw new Error("Stellar deployment result incomplete.");
          }
        } catch (e: any) {
          toast.error(String(e?.message ?? "Stellar deployment failed"));
          rootActions.setTxState({ type: "idle" });
          actions.setIsDeploying(false);
        }
      };

      const handleEvm = async () => {
        if (!txPromise) {
          rootActions.setTxState({ type: "idle" });
          actions.setIsDeploying(false);
          return;
        }
        try {
          let didSucceed = false;
          await handleTransactionResult(
            txPromise as Promise<WriteContractData>,
            {
              onSuccess(txHash) {
                rootActions.setTxState({ type: "deploying", txHash });
                didSucceed = true;
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
                rootActions.setTxState({ type: "idle" });
                toast.error(
                  String(txError.shortMessage ?? "Transaction failed")
                );
                actions.setIsDeploying(false);
              },
            }
          );
          if (!didSucceed) {
            rootActions.setTxState({ type: "idle" });
            actions.setIsDeploying(false);
          }
        } catch (e: any) {
          toast.error(String(e?.message ?? "Unknown error"));
          rootActions.setTxState({ type: "idle" });
          actions.setIsDeploying(false);
        }
      };

      if (sourceChain.chain_id === SUI_CHAIN_ID) return handleSui();
      if (sourceChain.chain_id === STELLAR_CHAIN_ID) return handleStellar();
      return handleEvm();
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

  let isSimErrorBlocking: boolean;
  if (SIMULATION_DISABLED_CHAIN_IDS.includes(chainId)) {
    isSimErrorBlocking = false;
  } else {
    isSimErrorBlocking = Boolean(simulationError);
  }

  const { children: buttonChildren, status: buttonStatus } = useMemo(() => {
    if (isSimErrorBlocking) {
      return {
        children: "Preparing transaction failed",
        status: "error" as const,
      };
    }
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
    isSimErrorBlocking,
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
