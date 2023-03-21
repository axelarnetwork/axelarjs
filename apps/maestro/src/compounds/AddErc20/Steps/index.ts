export type StepProps = {
  newTokenType: "new" | "existing";
  setNewTokenType: (tokenType: "new" | "existing") => void;
};

export * from "./Step1";
export * from "./Step2";
export * from "./Step3";
export * from "./Step4";
