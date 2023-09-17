import { createWalletClient, http, WalletClient } from "viem";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";

export async function createWallet() {
  if (globalThis.sessionStorage) {
    const privateKey = globalThis.sessionStorage.getItem(
      "axelar-wallet"
    ) as `0x${string}`;
    if (privateKey) {
      return createWalletClient({
        account: privateKeyToAccount(privateKey),
        transport: http(),
      });
    } else {
      const privateKey = generatePrivateKey();

      globalThis.sessionStorage.setItem("axelar-wallet", privateKey);
      return createWalletClient({
        account: privateKeyToAccount(privateKey),
        transport: http(),
      });
    }
  } else {
    return createWalletClient({
      account: privateKeyToAccount(generatePrivateKey()),
      transport: http(),
    });
  }
}

export function signOtc(wallet: WalletClient, message: string) {
  //TODO - this doesn't seem to work...
  //@ts-ignore
  return wallet.signMessage(message);
}
