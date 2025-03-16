// TODO: get the contract id from the chain config
export const stellarITSContractId =
  "CCD7JXLHOJKQDPKOXQTK6PYACFYQPRC25IVKHQDOMP3ANFMBWO5FZZAN";

export const formatTokenId = (tokenId: string) => {
  const hex = tokenId.replace(/^0x/, "").padStart(64, "0");
  return Buffer.from(hex, "hex");
};

export const stellarNetworkPassphrase = "Test SDF Network ; September 2015";

export const stellarEncodedRecipient = (
  destinationAddress: string
): `0x${string}` => `0x${Buffer.from(destinationAddress).toString("hex")}`;
