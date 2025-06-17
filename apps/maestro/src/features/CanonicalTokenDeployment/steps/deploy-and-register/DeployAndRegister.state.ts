import { Maybe } from "@axelarjs/utils";
import { useEffect, useState } from "react";

import { formatEther } from "viem";

import {
  NEXT_PUBLIC_INTERCHAIN_DEPLOYMENT_EXECUTE_DATA,
  NEXT_PUBLIC_INTERCHAIN_DEPLOYMENT_GAS_LIMIT,
} from "~/config/env";
import { useBalance, useChainId } from "~/lib/hooks";
import { toNumericString } from "~/lib/utils/bigint";
import { ITSChainConfig } from "~/server/chainConfig";
import { useAllChainConfigsQuery } from "~/services/axelarConfigs/hooks";
import { useEstimateGasFeeMultipleChainsQuery } from "~/services/axelarjsSDK/hooks";
import { useCanonicalTokenDeploymentStateContainer } from "../../CanonicalTokenDeployment.state";

export type UseStep3ChainSelectionStateProps = {
  selectedChains: Set<string>;
};

export function useStep3ChainSelectionState() {
  const { allChains } = useAllChainConfigsQuery();
  const chainId = useChainId();
  const userBalance = useBalance();
  const [isDeploying, setIsDeploying] = useState(false);
  const [totalGasFee, $setTotalGasFee] = useState(formatEther(0n));

  // Find source chain from both EVM and VM chains
  const currentChain = allChains?.find(
    (chain: ITSChainConfig) => chain.chain_id === chainId
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
    // gasMultiplier: 1.1,
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
    if (!currentChain || currentChain.id === sourceChainId) return;

    setSourceChainId(currentChain.id);
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
      $setTotalGasFee,
      setSourceChainId,
    },
  };
}
