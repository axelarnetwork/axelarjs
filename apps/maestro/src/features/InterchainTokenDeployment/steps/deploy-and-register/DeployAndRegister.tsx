import { Alert, Dialog, FormControl, Label, Tooltip } from "@axelarjs/ui";
import { ComponentRef, useMemo, useRef, type FC } from "react";

import { parseUnits } from "viem";

import { useBalance, useChainId } from "~/lib/hooks";
import { filterEligibleChains } from "~/lib/utils/chains";
import { getNativeToken } from "~/lib/utils/getNativeToken";
import ChainPicker from "~/ui/compounds/ChainPicker";
import { NextButton } from "~/ui/compounds/MultiStepForm";
import { useInterchainTokenDeploymentStateContainer } from "../../InterchainTokenDeployment.state";
import {
  useButtonChildren,
  useDestinationChainIds,
  useHandleSubmit,
} from "./DeployAndRegister.hooks";
import { useStep2ChainSelectionState } from "./DeployAndRegister.state";

export const Step2: FC = () => {
  const { state: rootState, actions: rootActions } =
    useInterchainTokenDeploymentStateContainer();

  const { state } = useStep2ChainSelectionState();

  const chainId = useChainId();

  // Handle both EVM and VM chains
  const sourceChain = state.chains.find((chain) => chain.chain_id === chainId);

  const [, erroredDestinationChainIds] = useDestinationChainIds();

  const { handleSubmit, isReady } = useHandleSubmit();

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

  const { children: buttonChildren, status: buttonStatus } = useButtonChildren({
    hasInsufficientGasBalance,
    nativeTokenSymbol,
    isReady,
  });

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
