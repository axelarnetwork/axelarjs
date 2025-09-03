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

export type DeployRemoteInterchainTokenInput = {
  caller: string;
  salt: string;
  destinationChain: string | string[];
  gasValue: string | string[];
};

export type DeployRemoteCanonicalInterchainTokenInput = {
  caller: string;
  tokenAddress: string;
  destinationChain: string | string[];
  gasValue: string | string[];
};

export type InterchainTransferInput = {
  caller: string;
  tokenId: string;
  tokenAddress: string;
  destinationChain: string;
  destinationAddress: string;
  amount: string;
  gasValue: string;
};
