import { nativeToScVal } from "@stellar/stellar-sdk";

import { addressToScVal, tokenToScVal } from ".";
import {
  STELLAR_ITS_CONTRACT_ID,
  XLM_ASSET_ADDRESS,
} from "./config";
import {
  createContractTransaction,
  fetchStellarAccount,
  hexToScVal,
} from "./transactions";

/**
 * Interface for the result of building an interchain transfer transaction
 */
export interface BuildInterchainTransferResult {
  transactionXDR: string;
}

/**
 * Builds the transaction for interchain token transfer on Stellar without executing it.
 * Returns the XDR of the transaction that can be signed and sent by the client.
 */
export async function buildInterchainTransferTransaction({
  tokenId,
  destinationChain,
  destinationAddress,
  amount,
  gasValue,
  caller,
}: {
  tokenId: string;
  destinationChain: string;
  destinationAddress: string;
  amount: number;
  gasValue: number;
  caller: string;
}): Promise<BuildInterchainTransferResult> {
  // Get the account information
  const account = await fetchStellarAccount(caller);

  // Create the transaction arguments
  const args = [
    addressToScVal(caller),
    hexToScVal(tokenId),
    nativeToScVal(destinationChain, { type: "string" }),
    hexToScVal(destinationAddress),
    nativeToScVal(amount, { type: "i128" }),
    nativeToScVal(null, { type: "void" }),
    tokenToScVal(XLM_ASSET_ADDRESS, gasValue),
  ];

  // Build the transaction
  const { transactionXDR } = await createContractTransaction({
    contractAddress: STELLAR_ITS_CONTRACT_ID,
    method: "interchain_transfer",
    account,
    args,
  });

  return { transactionXDR };
}
