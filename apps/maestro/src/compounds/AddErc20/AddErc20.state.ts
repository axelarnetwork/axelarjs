import { useState } from "react";

export const INITIAL_STATE = {};

export const useAddErc20State = () => {
  const [step, setStep] = useState(0);
  const [newTokenType, setNewTokenType] = useState<"new" | "existing">("new");
  const [tokenName, setTokenName] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [decimals, setDecimals] = useState(0);

  return {
    state: { step, newTokenType, tokenName, tokenSymbol, decimals },
    actions: {
      setStep,
      setNewTokenType,
      setTokenName,
      setTokenSymbol,
      setDecimals,
    },
  };
};
