import type { EVMChainConfig, VMChainConfig } from "@axelarjs/api/axelarscan";
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
import { useAllChainConfigsQuery } from "~/services/axelarscan/hooks";
import { useInterchainTokenDeploymentStateContainer } from "../../InterchainTokenDeployment.state";

type ChainConfig = EVMChainConfig | VMChainConfig;

export type UseStep2ChainSelectionStateProps = {
  selectedChains: Set<string>;
};

export function useStep2ChainSelectionState() {
  const { allChains } = useAllChainConfigsQuery();
  const chainId = useChainId();
  const userBalance = useBalance();
  const [isDeploying, setIsDeploying] = useState(false);
  const [totalGasFee, setTotalGasFee] = useState(formatEther(0n));

  const [sourceChainId, setSourceChainId] = useState<string>(() => {
    const chain = allChains?.find(
      (chain: ChainConfig) => chain.chain_id === chainId
    );
    return chain?.id || "";
  });

  const { state: rootState } = useInterchainTokenDeploymentStateContainer();

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
      .map(setTotalGasFee);
  }, [remoteDeploymentGasFees, setTotalGasFee, userBalance?.decimals]);

  const resetState = () => {
    setIsDeploying(false);
    setTotalGasFee(toNumericString(0n));
  };

  useEffect(() => {
    const candidateChain = allChains?.find(
      (chain) => chain.chain_id === chainId
    );
    if (!candidateChain || candidateChain.chain_name === sourceChainId) return;

    setSourceChainId(candidateChain.id);
  }, [allChains, chainId, sourceChainId]);

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
