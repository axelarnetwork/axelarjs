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
  const [txState, setTxState] = useState<DeployAndRegisterTransactionState>({
    type: "idle",
  });
  const resetAddErc20StateInputs = () => {
    setStep(0);
    setNewTokenType("new");
    setTokenName("");
    setTokenSymbol("");
    setDecimals(0);
    setAmountToMint(0);
    setTxState({ type: "idle" });
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
    },
    actions: {
      setStep,
      setNewTokenType,
      setTokenName,
      setTokenSymbol,
      setDecimals,
      setAmountToMint,
      setTxState,
      resetAddErc20StateInputs,
    },
  };
};
