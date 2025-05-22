import { Buffer } from "buffer";
import { Address, nativeToScVal, xdr } from "@stellar/stellar-sdk";

import {
  STELLAR_ITS_CONTRACT_ID,
  STELLAR_MULTICALL_CONTRACT_ID,
  XLM_ASSET_ADDRESS,
} from "./config";
import { createContractTransaction, fetchStellarAccount } from "./transactions";

// Interface for the result of building a remote deployment transaction
export interface BuildRemoteDeploymentResult {
  transactionXDR: string;
}

/**
 * Builds the transaction for deploying interchain tokens to remote chains without executing it.
 * Returns the XDR of the transaction that can be signed and sent by the client.
 */
export async function buildDeployRemoteInterchainTokensTransaction({
  caller,
  salt,
  destinationChainIds,
  gasValues,
  itsContractAddress = STELLAR_ITS_CONTRACT_ID,
  multicallContractAddress = STELLAR_MULTICALL_CONTRACT_ID,
  gasTokenAddress = XLM_ASSET_ADDRESS,
  minterAddress,
}: {
  caller: string;
  salt: string;
  destinationChainIds: string[];
  gasValues: string[] | bigint[];
  itsContractAddress?: string;
  multicallContractAddress?: string;
  gasTokenAddress?: string;
  minterAddress?: string;
}): Promise<{ transactionXDR: string }> {
  if (destinationChainIds.length !== gasValues.length) {
    throw new Error(
      "destinationChainIds and gasValues must have the same length"
    );
  }
  if (destinationChainIds.length === 0) {
    throw new Error("destinationChainIds cannot be empty");
  }

  const effectiveMinter = minterAddress || caller;

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

  for (let i = 0; i < destinationChainIds.length; i++) {
    const destinationChainId = destinationChainIds[i];
    const gasValue = gasValues[i];

    // Build the gas payment for this destination
    const gasPaymentScVal = _buildGasPaymentMapScVal(gasTokenAddress, gasValue);

    // Add arguments for deploy_remote_interchain_token in the correct order
    const deployRemoteArgs: xdr.ScVal[] = [
      _addressToScVal(effectiveMinter),
      _bytesToScVal(salt),
      _stringToScVal(destinationChainId),
      gasPaymentScVal,
    ];

    // Create the struct for the contract call following the original structure
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

  // Final arguments for the multicall
  const multicallArgs = xdr.ScVal.scvVec(callArgs);

  // Use the createContractTransaction utility function instead of manual transaction creation
  return createContractTransaction({
    contractAddress: multicallContractAddress,
    method: "multicall",
    account,
    args: [multicallArgs],
  });
}
