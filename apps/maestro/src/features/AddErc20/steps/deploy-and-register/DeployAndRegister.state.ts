import { useEffect, useState } from "react";

import type { EVMChainConfig } from "@axelarjs/api/axelarscan";
import { formatEther } from "viem";
import { useNetwork } from "wagmi";

import { useEstimateGasFeeMultipleChains } from "~/services/axelarjsSDK/hooks";
import { useEVMChainConfigsQuery } from "~/services/axelarscan/hooks";

import { useAddErc20StateContainer } from "../../AddErc20.state";

export type UseStep3ChainSelectionStateProps = {
  selectedChains: Set<string>;
};

export function useStep3ChainSelectionState() {
  const { data: evmChains } = useEVMChainConfigsQuery();
  const network = useNetwork();
  const [isDeploying, setIsDeploying] = useState(false);
  const [totalGasFee, $setTotalGasFee] = useState(formatEther(BigInt(0)));
  const [sourceChainId, setSourceChainId] = useState(
    evmChains?.find(
      (evmChain: EVMChainConfig) => evmChain.chain_id === network.chain?.id
    )?.chain_name as string
  );

  const { state: rootState } = useAddErc20StateContainer();

  const {
    data: gasFees,
    isLoading: isGasPriceQueryLoading,
    isError: isGasPriceQueryError,
  } = useEstimateGasFeeMultipleChains({
    sourceChainId,
    destinationChainIds: rootState.selectedChains,
    gasLimit: 1_000_000,
    gasMultipler: 2,
  });

  useEffect(() => gasFees && setTotalGasFee(gasFees), [gasFees]);

  const resetState = () => {
    setIsDeploying(false);
    $setTotalGasFee(formatEther(BigInt(0)));
  };

  const setTotalGasFee = (gasFees: bigint[]) => {
    const num = Number(formatEther(gasFees.reduce((a, b) => a + b, BigInt(0))));
    $setTotalGasFee(num.toFixed(4));
  };

  useEffect(
    () =>
      setSourceChainId(
        evmChains?.find((evmChain) => evmChain.chain_id === network.chain?.id)
          ?.chain_name as string
      ),
    [evmChains, network]
  );

  return {
    state: {
      network,
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
