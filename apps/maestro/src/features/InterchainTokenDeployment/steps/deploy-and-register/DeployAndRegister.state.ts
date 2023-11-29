import type { EVMChainConfig } from "@axelarjs/api/axelarscan";
import { useEffect, useState } from "react";

import { formatEther } from "viem";
import { useChainId } from "wagmi";

import {
  NEXT_PUBLIC_INTERCHAIN_DEPLOYMENT_GAS_LIMIT,
  NEXT_PUBLIC_INTERCHAIN_TRANSFER_GAS_LIMIT,
} from "~/config/env";
import { useEstimateGasFeeMultipleChainsQuery } from "~/services/axelarjsSDK/hooks";
import { useEVMChainConfigsQuery } from "~/services/axelarscan/hooks";
import { useInterchainTokenDeploymentStateContainer } from "../../InterchainTokenDeployment.state";

export type UseStep3ChainSelectionStateProps = {
  selectedChains: Set<string>;
};

export function useStep3ChainSelectionState() {
  const { data: evmChains } = useEVMChainConfigsQuery();
  const chainId = useChainId();
  const [isDeploying, setIsDeploying] = useState(false);
  const [totalGasFee, $setTotalGasFee] = useState(formatEther(0n));
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
    gasMultipler: 2,
  });

  const {
    data: remoteTransferGasFees,
    isLoading: isRemoteTransferGasFeeLoading,
    isError: isRemoteTransferGasFeeError,
  } = useEstimateGasFeeMultipleChainsQuery({
    sourceChainId,
    destinationChainIds:
      Number(rootState.tokenDetails.remoteTokenSupply ?? "0") > 0
        ? rootState.selectedChains
        : [],
    gasLimit: Number(NEXT_PUBLIC_INTERCHAIN_TRANSFER_GAS_LIMIT),
    gasMultipler: 2,
  });

  useEffect(
    () =>
      remoteDeploymentGasFees &&
      remoteTransferGasFees &&
      setTotalGasFee([...remoteDeploymentGasFees, ...remoteTransferGasFees]),
    [remoteDeploymentGasFees, remoteTransferGasFees]
  );

  const resetState = () => {
    setIsDeploying(false);
    $setTotalGasFee(formatEther(0n));
  };

  const setTotalGasFee = (fees: bigint[]) => {
    const num = Number(formatEther(fees.reduce((a, b) => a + b, 0n)));
    $setTotalGasFee(num.toFixed(4));
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
      isEstimatingGasFees:
        isRemoteDeploymentGasFeeLoading || isRemoteTransferGasFeeLoading,
      hasGasFeesEstimationError:
        isRemoteDeploymentGasFeeError || isRemoteTransferGasFeeError,
      remoteDeploymentGasFees,
      remoteTransferGasFees,
    },
    actions: {
      resetState,
      setIsDeploying,
      setTotalGasFee,
      setSourceChainId,
    },
  };
}
