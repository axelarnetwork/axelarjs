export const CONTRACT_METHODS = [
  "sendToken",
  "StandardizedTokenDeployed",
] as const;

export type ContractMethod = (typeof CONTRACT_METHODS)[number];
