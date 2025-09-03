export type DeployInterchainTokenInput = {
  caller: string;
  tokenName: string;
  tokenSymbol: string;
  decimals: number;
  initialSupply: string;
  salt: string;
  minterAddress?: string;
};

export type RegisterCanonicalInterchainTokenInput = {
  caller: string;
  tokenAddress: string;
};
