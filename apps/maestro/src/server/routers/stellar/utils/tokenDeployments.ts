import { Buffer } from "buffer";
import { Address, nativeToScVal, xdr } from "@stellar/stellar-sdk";

import { stellarChainConfig } from "~/config/chains";
import { 
  STELLAR_ITS_CONTRACT_ID, 
  STELLAR_MULTICALL_CONTRACT_ID, 
  STELLAR_NETWORK_PASSPHRASE, 
  XLM_ASSET_ADDRESS 
} from "./config";
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
  const actualMinterAddress = minterAddress || caller;
  const actualRpcUrl = rpcUrl || stellarChainConfig.rpcUrls.default.http[0];
  const actualNetworkPassphrase =
    networkPassphrase || STELLAR_NETWORK_PASSPHRASE;

  const account = await fetchStellarAccount(caller);

  const args: xdr.ScVal[] = [
    addressToScVal(caller),
    hexToScVal(salt),
    tokenMetadataToScVal(decimals, tokenName, tokenSymbol),
    nativeToScVal(initialSupply.toString(), { type: "i128" }),
    addressToScVal(actualMinterAddress),
  ];

  return createContractTransaction({
    contractAddress: STELLAR_ITS_CONTRACT_ID,
    method: "deploy_interchain_token",
    account,
    args,
    rpcUrl: actualRpcUrl,
    networkPassphrase: actualNetworkPassphrase,
  });
}

/**
 * Builds a single multicall transaction that combines token deployment and remote deployment.
 * This allows the entire process to be completed in a single transaction.
 */
export async function buildDeployAndRegisterRemoteInterchainTokenTransaction({
  caller,
  tokenName,
  tokenSymbol,
  decimals,
  initialSupply,
  salt,
  minterAddress,
  destinationChainIds,
  gasValues,
  itsContractAddress = STELLAR_ITS_CONTRACT_ID,
  multicallContractAddress = STELLAR_MULTICALL_CONTRACT_ID,
  gasTokenAddress = XLM_ASSET_ADDRESS,
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
  destinationChainIds: string[];
  gasValues: string[] | bigint[];
  itsContractAddress?: string;
  multicallContractAddress?: string;
  gasTokenAddress?: string;
  rpcUrl?: string;
  networkPassphrase?: string;
}): Promise<{ transactionXDR: string }> {
  if (destinationChainIds.length !== gasValues.length) {
    throw new Error(
      "destinationChainIds and gasValues must have the same length"
    );
  }

  const actualMinterAddress = minterAddress || caller;
  const actualRpcUrl = rpcUrl || stellarChainConfig.rpcUrls.default.http[0];
  const actualNetworkPassphrase =
    networkPassphrase || STELLAR_NETWORK_PASSPHRASE;

  const account = await fetchStellarAccount(caller);

  // Helper functions for ScVal creation
  function _addressToScVal(address: string): xdr.ScVal {
    return Address.fromString(address).toScVal();
  }

  function _bytesToScVal(hexString: string): xdr.ScVal {
    if (hexString.startsWith("0x")) {
      hexString = hexString.slice(2);
    }
    return xdr.ScVal.scvBytes(Buffer.from(hexString, "hex"));
  }

  function _stringToScVal(str: string): xdr.ScVal {
    return xdr.ScVal.scvString(str);
  }

  function _symbolToScVal(sym: string): xdr.ScVal {
    return xdr.ScVal.scvSymbol(sym);
  }

  function _bigIntToScValI128(num: string | bigint): xdr.ScVal {
    return nativeToScVal(BigInt(num.toString()), { type: "i128" });
  }

  function _buildGasPaymentMapScVal(
    gasTokenAddr: string,
    gasValue: string | bigint
  ): xdr.ScVal {
    const mapEntries: xdr.ScMapEntry[] = [
      new xdr.ScMapEntry({
        key: _symbolToScVal("address"),
        val: _addressToScVal(gasTokenAddr),
      }),
      new xdr.ScMapEntry({
        key: _symbolToScVal("amount"),
        val: _bigIntToScValI128(gasValue),
      }),
    ];
    return xdr.ScVal.scvMap(mapEntries);
  }

  // Build arguments for the multicall
  const callArgs: xdr.ScVal[] = [];

  // 1. First call: deploy_interchain_token
  const deployTokenArgs: xdr.ScVal[] = [
    _addressToScVal(caller),
    _bytesToScVal(salt),
    tokenMetadataToScVal(decimals, tokenName, tokenSymbol),
    _bigIntToScValI128(initialSupply),
    _addressToScVal(actualMinterAddress),
  ];

  const deployTokenCallArgsVec = xdr.ScVal.scvVec(deployTokenArgs);

  const deployTokenCallArgsMapEntries: xdr.ScMapEntry[] = [
    new xdr.ScMapEntry({
      key: _symbolToScVal("approver"),
      val: _addressToScVal(caller),
    }),
    new xdr.ScMapEntry({
      key: _symbolToScVal("args"),
      val: deployTokenCallArgsVec,
    }),
    new xdr.ScMapEntry({
      key: _symbolToScVal("contract"),
      val: _addressToScVal(itsContractAddress),
    }),
    new xdr.ScMapEntry({
      key: _symbolToScVal("function"),
      val: _symbolToScVal("deploy_interchain_token"),
    }),
  ];

  callArgs.push(xdr.ScVal.scvMap(deployTokenCallArgsMapEntries));

  // 2. Add remote deployment calls if there are destination chains
  if (destinationChainIds.length > 0) {
    for (let i = 0; i < destinationChainIds.length; i++) {
      const destinationChainId = destinationChainIds[i];
      const gasValue = gasValues[i];

      // Build the gas payment for this destination
      const gasPaymentScVal = _buildGasPaymentMapScVal(gasTokenAddress, gasValue);

      // Add arguments for deploy_remote_interchain_token in the correct order
      const deployRemoteArgs: xdr.ScVal[] = [
        _addressToScVal(actualMinterAddress),
        _bytesToScVal(salt),
        _stringToScVal(destinationChainId),
        gasPaymentScVal,
      ];

      // Create the struct for the contract call
      const callArgsVec = xdr.ScVal.scvVec(deployRemoteArgs);

      const callArgsMapEntries: xdr.ScMapEntry[] = [
        new xdr.ScMapEntry({
          key: _symbolToScVal("approver"),
          val: _addressToScVal(caller),
        }),
        new xdr.ScMapEntry({
          key: _symbolToScVal("args"),
          val: callArgsVec,
        }),
        new xdr.ScMapEntry({
          key: _symbolToScVal("contract"),
          val: _addressToScVal(itsContractAddress),
        }),
        new xdr.ScMapEntry({
          key: _symbolToScVal("function"),
          val: _symbolToScVal("deploy_remote_interchain_token"),
        }),
      ];

      callArgs.push(xdr.ScVal.scvMap(callArgsMapEntries));
    }
  }

  // Final arguments for the multicall
  const multicallArgs = xdr.ScVal.scvVec(callArgs);

  // Create the multicall transaction
  return createContractTransaction({
    contractAddress: multicallContractAddress,
    method: "multicall",
    account,
    args: [multicallArgs],
    rpcUrl: actualRpcUrl,
    networkPassphrase: actualNetworkPassphrase,
  });
}
