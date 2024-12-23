import { Maybe } from "@axelarjs/utils";
import { useEffect, useState } from "react";

import { formatEther } from "viem";

import {
  NEXT_PUBLIC_INTERCHAIN_DEPLOYMENT_EXECUTE_DATA,
  NEXT_PUBLIC_INTERCHAIN_DEPLOYMENT_GAS_LIMIT,
} from "~/config/env";
import { useBalance, useChainId } from "~/lib/hooks";
import { toNumericString } from "~/lib/utils/bigint";
import { useEstimateGasFeeMultipleChainsQuery } from "~/services/axelarjsSDK/hooks";
import { useEVMChainConfigsQuery } from "~/services/axelarscan/hooks";
import { useCanonicalTokenDeploymentStateContainer } from "../../CanonicalTokenDeployment.state";

export type UseStep3ChainSelectionStateProps = {
  selectedChains: Set<string>;
};

export function useStep3ChainSelectionState() {
  const { data: evmChains } = useEVMChainConfigsQuery();
  const chainId = useChainId();
  const userBalance = useBalance();
  const [isDeploying, setIsDeploying] = useState(false);
  const [totalGasFee, $setTotalGasFee] = useState(formatEther(0n));
  const [sourceChainId, setSourceChainId] = useState(
    evmChains?.find((evmChain) => evmChain.chain_id === chainId)?.id as string
  );

  const { state: rootState } = useCanonicalTokenDeploymentStateContainer();

  const {
    data: remoteDeploymentGasFees,
    isLoading: isRemoteDeploymentGasFeeLoading,
    isError: isRemoteDeploymentGasFeeError,
  } = useEstimateGasFeeMultipleChainsQuery({
    sourceChainId,
    destinationChainIds: rootState.selectedChains,
    gasLimit: Number(NEXT_PUBLIC_INTERCHAIN_DEPLOYMENT_GAS_LIMIT),
    executeData: NEXT_PUBLIC_INTERCHAIN_DEPLOYMENT_EXECUTE_DATA,
    gasMultiplier: "auto",
  });

  useEffect(() => {
    Maybe.of(remoteDeploymentGasFees?.totalGasFee)
      .map((value) => toNumericString(value, userBalance?.decimals || 18))
      .map($setTotalGasFee);
  }, [remoteDeploymentGasFees, $setTotalGasFee, userBalance?.decimals]);

  const resetState = () => {
    setIsDeploying(false);
    $setTotalGasFee(formatEther(0n));
  };

  useEffect(() => {
    const candidateChain = evmChains?.find(
      (evmChain) => evmChain.chain_id === chainId
    );
    if (!candidateChain || candidateChain.chain_name === sourceChainId) return;

    setSourceChainId(candidateChain.chain_name);
  }, [evmChains, chainId, sourceChainId]);

  return {
    state: {
      isDeploying,
      totalGasFee,
      sourceChainId,
      evmChains,
      isEstimatingGasFees: isRemoteDeploymentGasFeeLoading,
      hasGasFeesEstimationError: isRemoteDeploymentGasFeeError,
      remoteDeploymentGasFees,
    },
    actions: {
      resetState,
      setIsDeploying,
      $setTotalGasFee,
      setSourceChainId,
    },
  };
}
