type BaseParams = {};

export type GetOTCParams = BaseParams & {
  signerAddress?: `0x${string}`;
};

export type OTC = {
  otc: string;
  validationMsg: string;
};

export type DepositAddressResponse = {
  data: { roomId: string };
};

export type GetDepositAddressParams = {
  fromChain: string;
  toChain: string;
  destinationAddress: string;
  asset: string;
  publicAddress: `0x${string}`;
  signature: `0x${string}`;
};
