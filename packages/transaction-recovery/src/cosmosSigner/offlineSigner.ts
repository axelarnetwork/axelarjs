import {
  DirectSecp256k1HdWallet,
  type OfflineDirectSigner,
} from "@cosmjs/proto-signing";

export const getCosmosWallet = async (
  mnemonic: string,
  prefix: string
): Promise<OfflineDirectSigner> => {
  return DirectSecp256k1HdWallet.fromMnemonic(mnemonic, { prefix });
};
