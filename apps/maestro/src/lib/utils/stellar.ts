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

/**
 * Encodes a Stellar address as hex bytes with 0x prefix for use in Ethereum contracts
 * 
 * @param address - The Stellar address to encode
 * @returns The hex-encoded address with 0x prefix as an Ethereum-compatible hex string
 * @throws Error if address is null, undefined, or empty
 */
export function encodeStellarAddressAsBytes(address?: string | null): `0x${string}` {
  if (!address) {
    throw new Error("Stellar address cannot be empty or undefined");
  }
  
  const encoder = new TextEncoder();
  const addressBytes = encoder.encode(address);
  const hexString = Array.from(addressBytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return `0x${hexString}`;
}

export function normalizeStellarTokenAddress(tokenAddress: string): string {
  // If not Stellar or already a contract address, return as is
  if (tokenAddress.startsWith("C")) {
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
    const contractId = stellarAsset.contractId(STELLAR_NETWORK_PASSPHRASE);
    return contractId;
  } catch (error) {
    console.error("Error normalizing Stellar token address:", error);
    return tokenAddress; // Return original if conversion fails
  }
}
