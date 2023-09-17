type BaseParams = {};

export type GetOTCParams = BaseParams & {
  signerAddress?: `0x${string}`;
};

export type OTC = {
  otc: string;
  validationMsg: string;
};
