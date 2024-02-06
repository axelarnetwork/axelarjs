import type { EVMChainConfig } from "@axelarjs/api/axelarscan";
import { Maybe } from "@axelarjs/utils";
import { useEffect, useState } from "react";

import { reduce } from "rambda";
import { formatEther } from "viem";
import { useChainId } from "wagmi";

import { NEXT_PUBLIC_INTERCHAIN_DEPLOYMENT_GAS_LIMIT } from "~/config/env";
import { useEstimateGasFeeMultipleChainsQuery } from "~/services/axelarjsSDK/hooks";
import { useEVMChainConfigsQuery } from "~/services/axelarscan/hooks";
import { useInterchainTokenDeploymentStateContainer } from "../../InterchainTokenDeployment.state";

const toSum = reduce<bigint, bigint>((a, b) => a + b, 0n);

const toNumericString = (num: bigint) =>
  Number(formatEther(num)).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  });

export type UseStep3ChainSelectionStateProps = {
  selectedChains: Set<string>;
};

export function useStep3ChainSelectionState() {
  const { data: evmChains } = useEVMChainConfigsQuery();
  const chainId = useChainId();
  const [isDeploying, setIsDeploying] = useState(false);
  const [totalGasFee, setTotalGasFee] = useState(formatEther(0n));
  const [sourceChainId, setSourceChainId] = useState(
    evmChains?.find((evmChain: EVMChainConfig) => evmChain.chain_id === chainId)
      ?.id as string
  );

  const { state: rootState } = useInterchainTokenDeploymentStateContainer();

  const {
    data: remoteDeploymentGasFees,
    isLoading: isRemoteDeploymentGasFeeLoading,
    isError: isRemoteDeploymentGasFeeError,
  } = useEstimateGasFeeMultipleChainsQuery({
    sourceChainId,
    destinationChainIds: rootState.selectedChains,
    gasLimit: Number(NEXT_PUBLIC_INTERCHAIN_DEPLOYMENT_GAS_LIMIT),
    gasMultipler: 1.5,
  });

  useEffect(() => {
    Maybe.of(remoteDeploymentGasFees)
      .map(toSum)
      .map(toNumericString)
      .map(setTotalGasFee);
  }, [remoteDeploymentGasFees, setTotalGasFee]);

  const resetState = () => {
    setIsDeploying(false);
    setTotalGasFee(toNumericString(0n));
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
      setTotalGasFee,
      setSourceChainId,
    },
  };
}
