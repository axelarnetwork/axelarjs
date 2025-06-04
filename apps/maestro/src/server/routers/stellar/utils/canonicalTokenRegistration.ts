import { Address, Asset, nativeToScVal, xdr } from "@stellar/stellar-sdk";

import { hexToScVal } from ".";
import {
  STELLAR_ITS_CONTRACT_ID,
  STELLAR_MULTICALL_CONTRACT_ID,
  STELLAR_NETWORK_PASSPHRASE,
  STELLAR_SCA_FACTORY_CONTRACT_ID,
  XLM_ASSET_ADDRESS,
} from "./config";
import {
  checkIfTokenContractExists,
  createContractTransaction,
  fetchStellarAccount,
  simulateCall,
} from "./transactions";

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

  let tokenContractAddress = tokenAddress;

  if (tokenAddress.includes("-")) {
    const [assetCode, issuer] = tokenAddress.split("-");

    const stellarAsset = new Asset(assetCode, issuer);
    tokenContractAddress = stellarAsset.contractId(STELLAR_NETWORK_PASSPHRASE);
  } else if (!tokenAddress.startsWith("C")) {
    throw new Error("Invalid token address");
  }

  // Check if asset has a contract
  const exists = await checkIfTokenContractExists(tokenContractAddress);

  // If the asset doesn't have a contract, we'll add the SCA creation to the multicall
  if (!exists && tokenAddress.includes("-")) {
    const [assetCode, issuer] = tokenAddress.split("-");
    const stellarAsset = new Asset(assetCode, issuer);

    const assetScVal = assetToScVal(stellarAsset);

    const createSCAArgs: xdr.ScVal[] = [assetScVal];

    const createSCACallArgsVec = xdr.ScVal.scvVec(createSCAArgs);

    const createSCACallArgsMapEntries: xdr.ScMapEntry[] = [
      new xdr.ScMapEntry({
        key: _symbolToScVal("approver"),
        val: _addressToScVal(caller),
      }),
      new xdr.ScMapEntry({
        key: _symbolToScVal("args"),
        val: createSCACallArgsVec,
      }),
      new xdr.ScMapEntry({
        key: _symbolToScVal("contract"),
        val: _addressToScVal(STELLAR_SCA_FACTORY_CONTRACT_ID),
      }),
      new xdr.ScMapEntry({
        key: _symbolToScVal("function"),
        val: _symbolToScVal("create_stellar_asset_contract"),
      }),
    ];

    // Add the SCA creation call to the multicall arguments
    callArgs.push(xdr.ScVal.scvMap(createSCACallArgsMapEntries));
  } else if (!exists) {
    throw new Error(
      "Asset doesn't have a smart contract and is not in CODE-ISSUER format"
    );
  }

  // Get tokenId
  let tokenId = "";
  try {
    const { simulateResult } = await simulateCall({
      contractAddress: itsContractAddress,
      method: "canonical_interchain_token_id",
      account,
      args: [_addressToScVal(tokenContractAddress)],
    });
    // Convert the bytes to a hex string
    if (simulateResult._arm === "bytes" && simulateResult._value) {
      const buffer = simulateResult._value as Buffer;
      tokenId = buffer.toString("hex");
    }
  } catch (error: any) {
    console.log("Error checking token ID:", error);
  }

  // Check if token is already registered in its contract
  let isTokenRegistered = false;
  if (tokenId) {
    try {
      const method = "token_manager_address";
      const { simulateResult } = await simulateCall({
        contractAddress: itsContractAddress,
        method,
        account,
        args: [hexToScVal(`0x${tokenId}`)],
      });

      if (simulateResult._value?._value) {
        const contractAddress = Address.contract(
          simulateResult._value._value
        ).toString();

        const exists = await checkIfTokenContractExists(contractAddress);

        isTokenRegistered = exists;
      }
    } catch (error: any) {
      console.log("Error checking if token is registered:", error);
    }
  }

  // First call: register_canonical_token (only if not already registered)
  if (!isTokenRegistered) {
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

    const gasPaymentScVal = _buildGasPaymentMapScVal(gasTokenAddress, gasValue);

    // deploy_remote_canonical_token(token_address: address, destination_chain: string, spender: address, gas_token: option<Token>)
    const deployRemoteArgs: xdr.ScVal[] = [
      _addressToScVal(tokenContractAddress),
      _stringToScVal(destinationChainId),
      _addressToScVal(caller),
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

  // If we don't have any calls to make (token already registered, contract exists, and no remote deployments)
  if (callArgs.length === 0) {
    throw new Error(
      "Token is already registered and no remote deployments requested"
    );
  }

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

function assetToScVal(asset: Asset): any {
  return nativeToScVal(
    Buffer.from(asset.toXDRObject().toXDR("base64"), "base64"),
    { type: "bytes" }
  );
}
