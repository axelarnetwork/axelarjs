export type StepProps = {
  newTokenType: "new" | "existing";
  setNewTokenType: (tokenType: "new" | "existing") => void;
  tokenName: string;
  setTokenName: (tokenName: string) => void;
  tokenSymbol: string;
  setTokenSymbol: (tokenSymbol: string) => void;
  decimals: number;
  setDecimals: (decimals: number) => void;
};

export * from "./Step1";
export * from "./Step2";
export * from "./Step3";
export * from "./Step4";
export * from "./StepsSummary";
