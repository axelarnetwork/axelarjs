import { useState } from "react";

export const INITIAL_STATE = {};
export type DeployAndRegisterTransactionState = {
  type: "idle" | "deploying" | "deployed";
  txHash?: `0x${string}`;
  tokenAddress?: `0x${string}`;
};

export const useAddErc20State = () => {
  const [step, setStep] = useState(0);
  const [newTokenType, setNewTokenType] = useState<"new" | "existing">("new");
  const [tokenName, setTokenName] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [decimals, setDecimals] = useState(0);
  const [amountToMint, setAmountToMint] = useState(0);
  const [deployedTokenAddress, setDeployedTokenAddress] = useState("");
  const [txHash, setTxHash] = useState<`0x${string}`>();
  const [txState, setTxState] = useState<DeployAndRegisterTransactionState>({
    type: "idle",
  });
  const [selectedChains, setSelectedChains] = useState(new Set<string>());

  const resetAddErc20StateInputs = () => {
    setStep(0);
    setNewTokenType("new");
    setTokenName("");
    setTokenSymbol("");
    setDecimals(0);
    setAmountToMint(0);
    setTxState({ type: "idle" });
    setSelectedChains(new Set<string>());
  };
  const resetAllState = () => {
    resetAddErc20StateInputs();
    setDeployedTokenAddress("");
  };

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
      step,
      newTokenType,
      tokenName,
      tokenSymbol,
      decimals,
      amountToMint,
      txState,
      deployedTokenAddress,
      txHash,
      selectedChains,
    },
    actions: {
      setStep,
      setNewTokenType,
      setTokenName,
      setTokenSymbol,
      setDecimals,
      setAmountToMint,
      setDeployedTokenAddress,
      setTxState,
      resetAddErc20StateInputs,
      resetAllState,
      setTxHash,
      addSelectedChain,
      removeSelectedChain,
    },
  };
};
