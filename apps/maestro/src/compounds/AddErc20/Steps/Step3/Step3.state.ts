import { useEffect, useState } from "react";

import { BigNumber } from "ethers";
import { formatEther } from "ethers/lib/utils.js";
import { useNetwork } from "wagmi";

import { useEstimateGasFeeMultipleChains } from "~/lib/api/axelarjsSDK/hooks";
import { useEVMChainConfigsQuery } from "~/lib/api/axelarscan/hooks";

export function useStep3ChainSelectionState() {
  const { data: evmChains } = useEVMChainConfigsQuery();
  const [selectedChains, setSelectedChains] = useState(new Set<string>());
  const network = useNetwork();
  const [deployedTokenAddress, setDeployedTokenAddress] = useState("");
  const [isDeploying, setIsDeploying] = useState(false);
  const [totalGasFee, _setTotalGasFee] = useState(
    formatEther(BigNumber.from(0))
  );
  const [sourceChainId, setSourceChainId] = useState(
    evmChains?.find((evmChain) => evmChain.chain_id === network.chain?.id)
      ?.chain_name as string
  );
  const {
    data: gasFees,
    isLoading: isGasPriceQueryLoading,
    isError: isGasPriceQueryError,
  } = useEstimateGasFeeMultipleChains({
    sourceChainId,
    destinationChainIds: Array.from(selectedChains),
    gasLimit: 1_000_000,
    gasMultipler: 2,
  });

  useEffect(() => gasFees && setTotalGasFee(gasFees), [gasFees]);

  const resetState = () => {
    setSelectedChains(new Set<string>());
    setDeployedTokenAddress("");
    setIsDeploying(false);
    _setTotalGasFee(formatEther(BigNumber.from(0)));
  };

  const setTotalGasFee = (gasFees: BigNumber[]) => {
    const num = +formatEther(
      gasFees.reduce((a, b) => a.add(BigNumber.from(b)), BigNumber.from(0))
    );
    _setTotalGasFee(num.toFixed(4));
  };

  useEffect(
    () =>
      setSourceChainId(
        evmChains?.find((evmChain) => evmChain.chain_id === network.chain?.id)
          ?.chain_name as string
      ),
    [evmChains, network]
  );

  const addSelectedChain = (item: string) =>
    setSelectedChains((prev) => new Set(prev).add(item));

  const removeSelectedChain = (item: string) => {
    setSelectedChains((prev) => {
      if (!prev.has(item)) return prev;
      const next = new Set(prev);
      next.delete(item);
      return next;
    });
  };

  return {
    state: {
      selectedChains,
      deployedTokenAddress,
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
      addSelectedChain,
      removeSelectedChain,
      setDeployedTokenAddress,
      resetState,
      setIsDeploying,
      setTotalGasFee,
      setSourceChainId,
    },
  };
}
