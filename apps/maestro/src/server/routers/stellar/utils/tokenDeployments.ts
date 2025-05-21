import {
  Address,
  nativeToScVal,
  xdr,
} from "@stellar/stellar-sdk";

import { stellarChainConfig } from "~/config/chains";
import { NEXT_PUBLIC_STELLAR_NETWORK_PASSPHRASE } from "~/config/env";
import { STELLAR_ITS_CONTRACT_ID } from "./config";
import {
  createContractTransaction,
  fetchStellarAccount,
  hexToScVal,
  tokenMetadataToScVal,
} from "./transactions";

/**
 * Interface for the result of building a token deployment transaction
 */
export interface BuildTokenDeploymentResult {
  transactionXDR: string;
}

/**
 * Helper function to convert an address string to ScVal
 */
function addressToScVal(addressString: string): xdr.ScVal {
  return nativeToScVal(Address.fromString(addressString), { type: "address" });
}

/**
 * Builds the transaction for deploying an interchain token on Stellar without executing it.
 * Returns the XDR of the transaction that can be signed and sent by the client.
 */
export async function buildDeployInterchainTokenTransaction({
  caller,
  tokenName,
  tokenSymbol,
  decimals,
  initialSupply,
  salt,
  minterAddress,
  rpcUrl,
  networkPassphrase,
}: {
  caller: string;
  tokenName: string;
  tokenSymbol: string;
  decimals: number;
  initialSupply: string | bigint;
  salt: string;
  minterAddress?: string;
  rpcUrl?: string;
  networkPassphrase?: string;
}): Promise<{ transactionXDR: string }> {
  const actualRpcUrl = rpcUrl || stellarChainConfig.rpcUrls.default.http[0];
  const actualNetworkPassphrase = networkPassphrase || NEXT_PUBLIC_STELLAR_NETWORK_PASSPHRASE;
  
  const account = await fetchStellarAccount(caller);

  // Preparar os argumentos base
  const baseArgs: xdr.ScVal[] = [
    addressToScVal(caller),
    hexToScVal(salt),
    tokenMetadataToScVal(decimals, tokenName, tokenSymbol),
    nativeToScVal(initialSupply.toString(), { type: "i128" }),
  ];
  
  // Adicionar o minter apenas se minterAddress estiver disponível
  const args = minterAddress
    ? [...baseArgs, addressToScVal(minterAddress)]
    : [...baseArgs, xdr.ScVal.scvVoid()]; // Usar void quando não houver minterAddress

  return createContractTransaction({
    contractAddress: STELLAR_ITS_CONTRACT_ID,
    method: "deploy_interchain_token",
    account,
    args,
    rpcUrl: actualRpcUrl,
    networkPassphrase: actualNetworkPassphrase,
  });
}


