import { useState } from "react";

export const INITIAL_STATE = {};

export const useAddErc20State = () => {
  const [step, setStep] = useState(1);

  return {
    step,
    setStep,
  };
};
