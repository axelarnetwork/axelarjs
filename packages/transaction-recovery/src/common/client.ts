import {
  createWalletClient,
  custom,
  http,
  publicActions,
  type Hex,
  type PublicClient,
  type WalletClient,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";

import { EvmClientError } from "./error";

import "viem/window";

/**
 * Get the wallet client to send the native gas payment transaction. If the private key is not provided, then the browser-based wallet (window.ethereum) will be used.
 * @param rpcUrl - The RPC URL of the source chain.
 * @param privateKey - The private key of the sender.
 * @returns The wallet client to send the native gas payment transaction.
 */
export function getWalletClient(
  rpcUrl: string,
  privateKey?: string | undefined,
  publicClient?: PublicClient | undefined
): WalletClient {
  if (!window?.ethereum && !privateKey) {
    throw EvmClientError.WALLET_CLIENT_NOT_FOUND;
  }

  if (privateKey) {
    return createWalletClient({
      account: privateKeyToAccount(privateKey as Hex),
      transport: http(rpcUrl),
      chain: publicClient!.chain,
    }).extend(publicActions);
  } else {
    return createWalletClient({
      transport: custom(window.ethereum!),
      chain: publicClient!.chain,
    }).extend(publicActions);
  }
}
