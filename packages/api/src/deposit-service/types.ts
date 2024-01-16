export type DepositAddressNativeWrapParams = {
  fromChain: string;
  toChain: string;
  destinationAddress: string;
  refundAddress: string;
  salt: string; // hex string
};

export type DepositAddressNativeUnwrapParams = Omit<
  DepositAddressNativeWrapParams,
  "salt"
>;

export type DepositAddressNativeWrapResponse = {
  address: `0x${string}`;
};

export type DepositAddressNativeUnwrapResponse =
  DepositAddressNativeWrapResponse;
