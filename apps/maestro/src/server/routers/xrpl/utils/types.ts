export type InterchainTransferInput = {
  caller: string;
  tokenId: string;
  tokenAddress: string;
  destinationChain: string;
  destinationAddress: string;
  amount: string;
  gasValue: string;
};