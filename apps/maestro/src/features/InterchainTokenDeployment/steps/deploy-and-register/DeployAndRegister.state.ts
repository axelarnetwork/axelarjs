import type { EVMChainConfig, VMChainConfig } from "@axelarjs/api/axelarscan";
import { Maybe } from "@axelarjs/utils";
import { useEffect, useMemo, useState } from "react";

import { formatEther } from "viem";
import { useChainId } from "wagmi";

import {
  NEXT_PUBLIC_INTERCHAIN_DEPLOYMENT_EXECUTE_DATA,
  NEXT_PUBLIC_INTERCHAIN_DEPLOYMENT_GAS_LIMIT,
} from "~/config/env";
import { toNumericString } from "~/lib/utils/bigint";
import { useEstimateGasFeeMultipleChainsQuery } from "~/services/axelarjsSDK/hooks";
import { useEVMChainConfigsQuery, useVMChainConfigsQuery } from "~/services/axelarscan/hooks";
import { useInterchainTokenDeploymentStateContainer } from "../../InterchainTokenDeployment.state";

type ChainConfig = EVMChainConfig | VMChainConfig;

export type UseStep2ChainSelectionStateProps = {
  selectedChains: Set<string>;
};

export function useStep2ChainSelectionState() {
  const { data: evmChains } = useEVMChainConfigsQuery();
  const { data: vmChains } = useVMChainConfigsQuery();
  const chainId = useChainId();
  const [isDeploying, setIsDeploying] = useState(false);
  const [totalGasFee, setTotalGasFee] = useState(formatEther(0n));
  
  // Combine VM and EVM chains
  const allChains = useMemo(() => {
    return [...(evmChains || []), ...(vmChains || [])];
  }, [evmChains, vmChains]);

  const [sourceChainId, setSourceChainId] = useState<string>(() => {
    const chain = allChains?.find((chain: ChainConfig) => chain.chain_id === chainId);
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
      .map(toNumericString)
      .map(setTotalGasFee);
  }, [remoteDeploymentGasFees, setTotalGasFee]);

  const resetState = () => {
    setIsDeploying(false);
    setTotalGasFee(toNumericString(0n));
  };

  useEffect(() => {
    const candidateChain = allChains?.find(
      (chain) => chain.chain_id === chainId
    );
    if (!candidateChain || candidateChain.chain_name === sourceChainId) return;

    setSourceChainId(candidateChain.chain_name);
  }, [allChains, chainId, sourceChainId]);

  return {
    state: {
      isDeploying,
      totalGasFee,
      sourceChainId,
      chains: allChains,
      evmChains,
      vmChains,
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
