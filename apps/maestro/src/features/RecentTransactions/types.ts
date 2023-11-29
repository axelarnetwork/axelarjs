export const CONTRACT_METHODS = [
  "InterchainTransfer",
  "InterchainTokenDeploymentStarted",
] as const;

export type ContractMethod = (typeof CONTRACT_METHODS)[number];
