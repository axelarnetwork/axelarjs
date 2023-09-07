import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";

export async function getCosmosWallet(mnemonic: string, prefix: string) {
  return DirectSecp256k1HdWallet.fromMnemonic(mnemonic, { prefix });
}
