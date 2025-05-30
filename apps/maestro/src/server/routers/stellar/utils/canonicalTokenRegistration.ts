// import { Buffer } from "buffer"; // Commented out as it's not currently used
import { Address, nativeToScVal, xdr } from "@stellar/stellar-sdk";

import { hexToScVal } from ".";
import {
  STELLAR_ITS_CONTRACT_ID,
  STELLAR_MULTICALL_CONTRACT_ID,
  XLM_ASSET_ADDRESS,
} from "./config";
import {
  checkIfContractExists,
  checkIfTokenContractExists,
  createContractTransaction,
  fetchStellarAccount,
  simulateCall,
} from "./transactions";

// Interface for the result of building a canonical token registration transaction
export interface BuildCanonicalRegistrationResult {
  transactionXDR: string;
}

/**
 * Builds the transaction for registering a canonical token on Stellar and optionally deploying it to remote chains.
 * Returns the XDR of the transaction that can be signed and sent by the client.
 */
export async function buildRegisterCanonicalTokenTransaction({
  caller,
  tokenAddress,
  destinationChainIds = [],
  gasValues = [],
  itsContractAddress = STELLAR_ITS_CONTRACT_ID,
  multicallContractAddress = STELLAR_MULTICALL_CONTRACT_ID,
  gasTokenAddress = XLM_ASSET_ADDRESS,
}: {
  caller: string;
  tokenAddress: string;
  destinationChainIds?: string[];
  gasValues?: string[] | bigint[];
  itsContractAddress?: string;
  multicallContractAddress?: string;
  gasTokenAddress?: string;
}): Promise<{ transactionXDR: string }> {
  // Validate inputs
  if (
    destinationChainIds.length !== gasValues.length &&
    destinationChainIds.length > 0
  ) {
    throw new Error(
      "destinationChainIds and gasValues must have the same length"
    );
  }

  const account = await fetchStellarAccount(caller);

  // Get tokenId
  let tokenId = "";
  try {
    const { simulateResult } = await simulateCall({
      contractAddress: itsContractAddress,
      method: "canonical_interchain_token_id",
      account,
      args: [_addressToScVal(tokenAddress)],
    });

    // Convert the bytes to a hex string
    if (simulateResult._arm === "bytes" && simulateResult._value) {
      const buffer = simulateResult._value as Buffer;
      tokenId = buffer.toString("hex");
      console.log("Token ID (hex):", tokenId);
    }
  } catch (error: any) {
    console.log("Error checking token ID:", error);
  }

  // Check if token is already registered in its contract
  let isTokenRegistered = false;
  if (tokenId) {
    try {
      console.log("Checking if token is registered");
      const { simulateResult } = await simulateCall({
        contractAddress: itsContractAddress,
        method: "interchain_token_address",
        account,
        args: [hexToScVal(`0x${tokenId}`)],
      });

      if (simulateResult._value?._value) {
        const contractAddress = Address.contract(
          simulateResult._value._value
        ).toString();
        console.log("Token registrado:", contractAddress);

        const exists = await checkIfTokenContractExists(contractAddress);
        isTokenRegistered = exists;
      }
    } catch (error: any) {
      console.log("Error checking if token is registered:", error);
    }
  }

  console.log("tokenId:", tokenId);

  // Build arguments for the multicall
  const callArgs: xdr.ScVal[] = [];

  // First call: register_canonical_token (only if not already registered)
  if (!isTokenRegistered) {
    const registerCanonicalArgs: xdr.ScVal[] = [_addressToScVal(tokenAddress)];

    const registerCallArgsVec = xdr.ScVal.scvVec(registerCanonicalArgs);

    const registerCallArgsMapEntries: xdr.ScMapEntry[] = [
      new xdr.ScMapEntry({
        key: _symbolToScVal("approver"),
        val: _addressToScVal(caller),
      }),
      new xdr.ScMapEntry({
        key: _symbolToScVal("args"),
        val: registerCallArgsVec,
      }),
      new xdr.ScMapEntry({
        key: _symbolToScVal("contract"),
        val: _addressToScVal(itsContractAddress),
      }),
      new xdr.ScMapEntry({
        key: _symbolToScVal("function"),
        val: _symbolToScVal("register_canonical_token"),
      }),
    ];

    callArgs.push(xdr.ScVal.scvMap(registerCallArgsMapEntries));
  }

  // If we have remote deployments, we need to use multicall
  if (destinationChainIds.length > 0) {
    // Add deploy_remote_interchain_token calls for each destination chain
    for (let i = 0; i < destinationChainIds.length; i++) {
      const destinationChainId = destinationChainIds[i];
      const gasValue = gasValues[i];

      // Build the gas payment for this destination
      const gasPaymentScVal = _buildGasPaymentMapScVal(
        gasTokenAddress,
        gasValue
      );

      // Add arguments for deploy_remote_interchain_token in the correct order
      const deployRemoteArgs: xdr.ScVal[] = [
        _addressToScVal(caller),
        hexToScVal(`0x${tokenId}`), // Usar tokenId como bytes com o formato correto
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
          val: _symbolToScVal("deploy_remote_canonical_token"),
        }),
      ];

      callArgs.push(xdr.ScVal.scvMap(callArgsMapEntries));
    }

    // If we don't have any calls to make (token already registered and no remote deployments)
    if (callArgs.length === 0) {
      throw new Error(
        "Token is already registered and no remote deployments requested"
      );
    }

    // Final arguments for the multicall
    const multicallArgs = xdr.ScVal.scvVec(callArgs);

    // Use the createContractTransaction utility function
    return createContractTransaction({
      contractAddress: multicallContractAddress,
      method: "multicall",
      account,
      args: [multicallArgs],
    });
  } else {
    // If no remote deployments, just register the canonical token (if not already registered)
    if (isTokenRegistered) {
      throw new Error("Token is already registered");
    }

    return createContractTransaction({
      contractAddress: itsContractAddress,
      method: "register_canonical_token",
      account,
      args: [_addressToScVal(tokenAddress)],
    });
  }
}

// Helper functions for ScVal creation
function _addressToScVal(address: string): xdr.ScVal {
  // Remove prefixes like "STX-" from the address
  const cleanAddress = address.includes("-") ? address.split("-")[1] : address;
  return Address.fromString(cleanAddress).toScVal();
}

// Usando hexToScVal importado em vez de uma função local

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
