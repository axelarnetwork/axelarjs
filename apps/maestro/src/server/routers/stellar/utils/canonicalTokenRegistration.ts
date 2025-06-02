// import { Buffer } from "buffer"; // Commented out as it's not currently used
import { Address, Asset, nativeToScVal, xdr } from "@stellar/stellar-sdk";

import { hexToScVal } from ".";
import {
  STELLAR_ITS_CONTRACT_ID,
  STELLAR_MULTICALL_CONTRACT_ID,
  STELLAR_NETWORK_PASSPHRASE,
  XLM_ASSET_ADDRESS,
} from "./config";
import {
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

  let account = await fetchStellarAccount(caller);
  // Build arguments for the multicall
  const callArgs: xdr.ScVal[] = [];

  let tokenContractAddress = "";

  if (tokenAddress.includes("-")) {
    const [assetCode, issuer] = tokenAddress.split("-");

    const stellarAsset = new Asset(assetCode, issuer);
    tokenContractAddress = stellarAsset.contractId(STELLAR_NETWORK_PASSPHRASE);
  }

  // check if asset have a contract
  const exists = await checkIfTokenContractExists(tokenContractAddress);
  if (!exists) {
    throw new Error("Token contract does not exist");
  }

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
        console.log("possible tokenId, checking if exists:", contractAddress);

        const exists = await checkIfTokenContractExists(contractAddress);
        isTokenRegistered = exists;
        console.log("isTokenRegistered", isTokenRegistered);
      }
    } catch (error: any) {
      console.log("Error checking if token is registered:", error);
    }
  }

  if (isTokenRegistered) {
    console.log(
      "Token is already registered on ITS, skip to remote deployment"
    );
  }

  // First call: register_canonical_token (only if not already registered)
  if (!isTokenRegistered) {
    console.log("added register canonical token to multicall");
    const registerCanonicalArgs: xdr.ScVal[] = [
      _addressToScVal(tokenContractAddress),
    ];

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

  // Add deploy_remote_interchain_token calls for each destination chain
  for (let i = 0; i < destinationChainIds.length; i++) {
    const destinationChainId = destinationChainIds[i];
    const gasValue = gasValues[i];

    // Build the gas payment for this destination
    const gasPaymentScVal = _buildGasPaymentMapScVal(gasTokenAddress, gasValue);

    // Add arguments for deploy_remote_canonical_token in the correct order
    // deploy_remote_canonical_token(token_address: address, destination_chain: string, spender: address, gas_token: option<Token>)
    const deployRemoteArgs: xdr.ScVal[] = [
      _addressToScVal(tokenAddress), // token_address: address do token canônico
      _stringToScVal(destinationChainId), // destination_chain: string
      _addressToScVal(caller), // spender: address
      gasPaymentScVal, // gas_token: option<Token>
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

  // Atualizar a conta com os dados mais recentes
  account = await fetchStellarAccount(caller);

  // Create the transaction
  const { transactionXDR } = await createContractTransaction({
    contractAddress: multicallContractAddress,
    method: "multicall",
    account,
    args: [xdr.ScVal.scvVec(callArgs)],
  });

  return { transactionXDR };
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
