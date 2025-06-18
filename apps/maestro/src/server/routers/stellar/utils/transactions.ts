import { createHash } from "crypto";
import { TimeoutInfinite } from "@stellar/stellar-sdk";
import {
  Account,
  BASE_FEE,
  Contract,
  nativeToScVal,
  rpc,
  TransactionBuilder,
  xdr,
} from "stellar-sdk";

import {
  STELLAR_HORIZON_URL,
  STELLAR_NETWORK_PASSPHRASE,
  STELLAR_RPC_URL,
} from "./config";

// Function to convert a string to a bytes32 format
export function saltToBytes32(input: string): string {
  // If it's already a hex string, ensure it's properly formatted
  if (/^(0x)?[0-9a-fA-F]+$/.test(input)) {
    // Remove 0x prefix if present
    const cleanHex = input.startsWith("0x") ? input.slice(2) : input;
    // Pad to 64 characters (32 bytes)
    return cleanHex.padStart(64, "0");
  }

  // Otherwise, create a hash from the input
  const hash = createHash("sha256").update(input).digest("hex");
  return hash;
}

// Function to convert hex string to ScVal bytes
export function hexToScVal(hexString: string): xdr.ScVal {
  const cleanHex = hexString.startsWith("0x") ? hexString.slice(2) : hexString;
  return xdr.ScVal.scvBytes(Buffer.from(cleanHex, "hex"));
}

// Function to create token metadata map
export function tokenMetadataToScVal(
  decimal: number,
  name: string,
  symbol: string
): xdr.ScVal {
  // Create map entries with key-value pairs
  const decimalEntry = new xdr.ScMapEntry({
    key: xdr.ScVal.scvSymbol("decimal"),
    val: nativeToScVal(decimal, { type: "u32" }),
  });

  const nameEntry = new xdr.ScMapEntry({
    key: xdr.ScVal.scvSymbol("name"),
    val: nativeToScVal(name, { type: "string" }),
  });

  const symbolEntry = new xdr.ScMapEntry({
    key: xdr.ScVal.scvSymbol("symbol"),
    val: nativeToScVal(symbol, { type: "string" }),
  });

  // Return the complete map
  return xdr.ScVal.scvMap([decimalEntry, nameEntry, symbolEntry]);
}

// Function to fetch account details
export async function fetchStellarAccount(accountId: string): Promise<Account> {
  const accountResponse = await fetch(
    `${STELLAR_HORIZON_URL}/accounts/${accountId}`
  );

  if (!accountResponse.ok) {
    throw new Error(
      `Failed to fetch account details: ${accountResponse.statusText}`
    );
  }

  const accountData = await accountResponse.json();
  return new Account(accountId, accountData.sequence);
}

// Function to create and prepare a Stellar contract transaction
export async function createContractTransaction({
  contractAddress,
  method,
  account,
  args,
  rpcUrl = STELLAR_RPC_URL,
  networkPassphrase = STELLAR_NETWORK_PASSPHRASE,
}: {
  contractAddress: string;
  method: string;
  account: Account;
  args: xdr.ScVal[];
  rpcUrl?: string;
  networkPassphrase?: string;
}): Promise<{
  transactionXDR: string;
  preparedTransaction: any;
}> {
  const contract = new Contract(contractAddress);
  const server = new rpc.Server(rpcUrl);
  const operation = contract.call(method, ...args);

  // Step 1: Build initial transaction
  const txBuilder = new TransactionBuilder(account, {
    fee: BASE_FEE,
    networkPassphrase,
  }).addOperation(operation);

  const builtTransaction = txBuilder.setTimeout(TimeoutInfinite).build();

  // Step 2: Prepare the transaction to get resource requirements
  let preparedTransaction;
  try {
    preparedTransaction = await server.prepareTransaction(builtTransaction);
  } catch (error) {
    console.error("Error preparing transaction:", error);
    throw error;
  }

  // Step 3: Calculate boosted fee
  const boostedFee = Math.ceil(Number(preparedTransaction.fee) * 1.2);

  const refreshedAccount = await server.getAccount(account.accountId());

  // Step 4: Build new transaction with boosted fee
  const feeBoostedTxBuilder = new TransactionBuilder(refreshedAccount, {
    fee: boostedFee.toString(),
    networkPassphrase,
  }).addOperation(operation);

  const feeBoostedTransaction = feeBoostedTxBuilder
    .setTimeout(TimeoutInfinite)
    .build();

  // Step 5: Prepare the boosted transaction (CRITICAL - gets resource footprint)
  let finalPreparedTransaction;
  try {
    finalPreparedTransaction = await server.prepareTransaction(
      feeBoostedTransaction
    );
  } catch (error) {
    console.error("Error preparing boosted transaction:", error);
    throw error;
  }

  // Step 6: Get the final XDR
  const transactionXDR = finalPreparedTransaction.toEnvelope().toXDR("base64");

  return {
    transactionXDR,
    preparedTransaction: finalPreparedTransaction,
  };
}

export async function simulateCall({
  contractAddress,
  method,
  account,
  args,
  rpcUrl = STELLAR_RPC_URL,
  networkPassphrase = STELLAR_NETWORK_PASSPHRASE,
}: {
  contractAddress: string;
  method: string;
  account: Account;
  args: xdr.ScVal[];
  rpcUrl?: string;
  networkPassphrase?: string;
}): Promise<{
  simulateResult: any;
}> {
  // Create a Contract instance
  const contract = new Contract(contractAddress);

  // Create RPC server instance for preparing the transaction
  const server = new rpc.Server(rpcUrl);

  // Create the operation using the contract.call method
  const operation = contract.call(method, ...args);

  // Build the transaction
  const builtTransaction = new TransactionBuilder(account, {
    fee: BASE_FEE,
    networkPassphrase,
  })
    .addOperation(operation)
    .setTimeout(TimeoutInfinite)
    .build();

  // Get the XDR before preparing
  // const xdrBeforePrepare = builtTransaction.toEnvelope().toXDR("base64");

  // Prepare the transaction (simulate and discover storage footprint)
  let simulateResult: any;
  try {
    simulateResult = await server.simulateTransaction(builtTransaction);
    simulateResult = simulateResult.result.retval;
  } catch (error) {
    console.error("Error simulating transaction:", error);
    throw error;
  }

  return {
    simulateResult,
  };
}

export async function checkIfTokenContractExists(contractAddress: string) {
  const server = new rpc.Server(STELLAR_RPC_URL);
  try {
    await server.getContractData(
      contractAddress,
      xdr.ScVal.scvLedgerKeyContractInstance()
    );
    return true;
  } catch (e) {
    return false;
  }
}
