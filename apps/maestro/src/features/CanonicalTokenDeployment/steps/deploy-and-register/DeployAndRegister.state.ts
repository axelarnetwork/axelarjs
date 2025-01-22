import type { EVMChainConfig, VMChainConfig } from "@axelarjs/api/axelarscan";
import { useEffect, useState } from "react";

import { formatEther } from "viem";
import { useChainId } from "wagmi";

import {
  NEXT_PUBLIC_INTERCHAIN_DEPLOYMENT_EXECUTE_DATA,
  NEXT_PUBLIC_INTERCHAIN_DEPLOYMENT_GAS_LIMIT,
} from "~/config/env";
import { useEstimateGasFeeMultipleChainsQuery } from "~/services/axelarjsSDK/hooks";
import { useAllChainConfigsQuery } from "~/services/axelarscan/hooks";
import { useCanonicalTokenDeploymentStateContainer } from "../../CanonicalTokenDeployment.state";

export type UseStep3ChainSelectionStateProps = {
  selectedChains: Set<string>;
};

export function useStep3ChainSelectionState() {
  const { allChains } = useAllChainConfigsQuery();
  const chainId = useChainId();
  const [isDeploying, setIsDeploying] = useState(false);
  const [totalGasFee, $setTotalGasFee] = useState(formatEther(0n));

  // Find source chain from both EVM and VM chains
  const currentChain = allChains?.find(
    (chain: EVMChainConfig | VMChainConfig) => chain.chain_id === chainId
  );

  const [sourceChainId, setSourceChainId] = useState<string>(
    currentChain?.id || ""
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

  useEffect(
    () =>
      remoteDeploymentGasFees &&
      setTotalGasFee(remoteDeploymentGasFees.totalGasFee),
    [remoteDeploymentGasFees]
  );

  const resetState = () => {
    setIsDeploying(false);
    $setTotalGasFee(formatEther(0n));
  };

  const setTotalGasFee = (total: bigint) => {
    const num = Number(formatEther(total));
    $setTotalGasFee(num.toFixed(4));
  };

  useEffect(() => {
    if (!currentChain || currentChain.chain_name === sourceChainId) return;

    setSourceChainId(currentChain.chain_name);
  }, [currentChain, chainId, sourceChainId]);

  return {
    state: {
      isDeploying,
      totalGasFee,
      sourceChainId,
      chains: allChains,
      isEstimatingGasFees: isRemoteDeploymentGasFeeLoading,
      hasGasFeesEstimationError: isRemoteDeploymentGasFeeError,
      remoteDeploymentGasFees,
    },
    actions: {
      resetState,
      setIsDeploying,
      setTotalGasFee,
      setSourceChainId,
    },
  };
}
