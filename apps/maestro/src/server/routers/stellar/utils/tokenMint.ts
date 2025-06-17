import { Address, nativeToScVal, xdr } from "@stellar/stellar-sdk";

import { stellarChainConfig } from "~/config/chains";
import { STELLAR_NETWORK_PASSPHRASE } from "./config";
import {
  createContractTransaction,
  fetchStellarAccount,
  simulateCall,
} from "./transactions";

// Endereço do contrato hardcodado para o mint de tokens
export const MINT_CONTRACT_ADDRESS =
  "CCZC7UHYOCCGZ2I5XGX7LI5GNCTCGPZR3M2I7AKZWBIL4VKQAORRREB6";

/**
 * Interface for the result of building a token mint transaction
 */
export interface BuildTokenMintResult {
  transactionXDR: string;
}

/**
 * Helper function to convert an address string to ScVal
 */
function addressToScVal(addressString: string): xdr.ScVal {
  return nativeToScVal(Address.fromString(addressString), { type: "address" });
}

/**
 * Builds the transaction for minting tokens on Stellar without executing it.
 * Returns the XDR of the transaction that can be signed and sent by the client.
 */
export async function buildMintTokenTransaction({
  caller,
  toAddress,
  tokenAddress,
  amount,
  rpcUrl,
  networkPassphrase,
}: {
  caller: string;
  toAddress: string;
  tokenAddress: string;
  amount: string | bigint;
  rpcUrl?: string;
  networkPassphrase?: string;
}): Promise<{ transactionXDR: string }> {
  const actualRpcUrl = rpcUrl || stellarChainConfig.rpcUrls.default.http[0];
  const actualNetworkPassphrase =
    networkPassphrase || STELLAR_NETWORK_PASSPHRASE;

  let account = await fetchStellarAccount(caller);

  const isMinterArgs: xdr.ScVal[] = [addressToScVal(caller)];

  try {
    const { simulateResult } = await simulateCall({
      contractAddress: tokenAddress,
      method: "is_minter",
      account,
      args: isMinterArgs,
    });

    if (simulateResult._switch && simulateResult._switch.name === "scvBool") {
      const isMinter = simulateResult._value === true;

      if (!isMinter) {
        throw new Error("Caller is not an authorized minter");
      }
    }
  } catch (error) {
    console.error(error);
    throw error;
  }

  const args: xdr.ScVal[] = [
    addressToScVal(caller),
    addressToScVal(toAddress),
    nativeToScVal(amount.toString(), { type: "i128" }),
  ];

  account = await fetchStellarAccount(caller);

  const { transactionXDR } = await createContractTransaction({
    contractAddress: tokenAddress,
    method: "mint_from",
    account,
    args,
    rpcUrl: actualRpcUrl,
    networkPassphrase: actualNetworkPassphrase,
  });

  return {
    transactionXDR,
  };
}
