import { Address, nativeToScVal, xdr } from "@stellar/stellar-sdk";

import { stellarChainConfig } from "~/config/chains";
import { NEXT_PUBLIC_STELLAR_NETWORK_PASSPHRASE } from "~/config/env";
import { createContractTransaction, fetchStellarAccount } from "./transactions";

// Endereço do contrato hardcodado para o mint de tokens
export const MINT_CONTRACT_ADDRESS =
  "CAOUTBGYGR3OYX3XC5GMDL447WFW7QFLW3ISJUCX4YGO65USFHAUBLGQ";

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
  amount,
  rpcUrl,
  networkPassphrase,
}: {
  caller: string;
  toAddress: string;
  amount: string | bigint;
  rpcUrl?: string;
  networkPassphrase?: string;
}): Promise<{ transactionXDR: string }> {
  const actualRpcUrl = rpcUrl || stellarChainConfig.rpcUrls.default.http[0];
  const actualNetworkPassphrase =
    networkPassphrase || NEXT_PUBLIC_STELLAR_NETWORK_PASSPHRASE;

  const account = await fetchStellarAccount(caller);

  const args: xdr.ScVal[] = [
    addressToScVal(toAddress),
    nativeToScVal(amount.toString(), { type: "i128" }),
  ];

  return createContractTransaction({
    contractAddress: MINT_CONTRACT_ADDRESS,
    method: "mint",
    account,
    args,
    rpcUrl: actualRpcUrl,
    networkPassphrase: actualNetworkPassphrase,
  });
}
