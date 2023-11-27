import type { EVMChainConfig } from "@axelarjs/api/axelarscan";
import { useEffect, useState } from "react";

import { formatEther } from "viem";
import { useChainId } from "wagmi";

import { useEstimateGasFeeMultipleChainsQuery } from "~/services/axelarjsSDK/hooks";
import { useEVMChainConfigsQuery } from "~/services/axelarscan/hooks";
import { useAddErc20StateContainer } from "../../AddErc20.state";

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

  const { state: rootState } = useAddErc20StateContainer();

  const {
    data: gasFees,
    isLoading: isGasPriceQueryLoading,
    isError: isGasPriceQueryError,
  } = useEstimateGasFeeMultipleChainsQuery({
    sourceChainId,
    destinationChainIds: rootState.selectedChains,
    gasLimit: 1_000_000,
    gasMultipler: 2,
  });

  useEffect(() => gasFees && setTotalGasFee(gasFees), [gasFees]);

  const resetState = () => {
    setIsDeploying(false);
    $setTotalGasFee(formatEther(0n));
  };

  const setTotalGasFee = (gasFees: bigint[]) => {
    const num = Number(formatEther(gasFees.reduce((a, b) => a + b, 0n)));
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
      isGasPriceQueryLoading,
      isGasPriceQueryError,
      gasFees,
    },
    actions: {
      resetState,
      setIsDeploying,
      setTotalGasFee,
      setSourceChainId,
    },
  };
}
