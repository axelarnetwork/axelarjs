import { useState } from "react";

export const INITIAL_STATE = {};

export const useAddErc20State = () => {
  const [step, setStep] = useState(0);
  const [newTokenType, setNewTokenType] = useState<"new" | "existing">("new");

  return {
    state: { step, newTokenType },
    actions: { setStep, setNewTokenType },
  };
};
