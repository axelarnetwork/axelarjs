import { createLocalStorageStateManager } from "@axelarjs/utils/react";

import { Asset } from "@stellar/stellar-sdk";

import { STELLAR_NETWORK_PASSPHRASE } from "~/server/routers/stellar/utils/config";

export const STELLAR_CONNECTION_CHANGE = "stellar-wallet-connection-change";
const STORAGE_KEY = "stellar-wallet-connected";

export const {
  setState: setStellarConnectionState,
  getState: getStellarConnectionState,
} = createLocalStorageStateManager<boolean>(
  STORAGE_KEY,
  STELLAR_CONNECTION_CHANGE
);

export function normalizeStellarTokenAddress(
  tokenAddress: string,
  chainName?: string
): string {
  // If not Stellar or already a contract address, return as is
  if (!chainName || chainName !== "Stellar" || tokenAddress.startsWith("C")) {
    return tokenAddress;
  }

  // Check for both ':' and '-' separators
  const separator = tokenAddress.includes(":")
    ? ":"
    : tokenAddress.includes("-")
      ? "-"
      : null;

  if (!separator) {
    return tokenAddress; // No valid separator found, return original
  }

  try {
    const [assetCode, issuer] = tokenAddress.split(separator);
    const stellarAsset = new Asset(assetCode, issuer);
    return stellarAsset.contractId(STELLAR_NETWORK_PASSPHRASE);
  } catch (error) {
    console.error("Error normalizing Stellar token address:", error);
    return tokenAddress; // Return original if conversion fails
  }
}
