export type DepositAddressNativeWrapParams = {
  fromChain: string;
  toChain: string;
  destinationAddress: string;
  refundAddress: string;
  salt: string; // hex string
};

export type DepositAddressNativeWrapResponse = {
  address: `0x${string}`;
};
