import { createHash, randomUUID } from "crypto";
import {
  Account,
  Address,
  BASE_FEE,
  Contract,
  nativeToScVal,
  Networks,
  Operation,
  rpc, // Provides rpc.Server
  TimeoutInfinite,
  TransactionBuilder,
  xdr,
} from "stellar-sdk";

// Using Networks.TESTNET as default, but can be overridden in function parameters

// Constants
export const STELLAR_TESTNET_HORIZON_URL =
  "https://horizon-testnet.stellar.org";
export const STELLAR_TESTNET_RPC_URL =
  "https://soroban-testnet.stellar.org:443";
export const INTERCHAIN_TOKEN_SERVICE_CONTRACT =
  "CCXT3EAQ7GPQTJWENU62SIFBQ3D4JMNQSB77KRPTGBJ7ZWBYESZQBZRK";

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
    `${STELLAR_TESTNET_HORIZON_URL}/accounts/${accountId}`
  );

  if (!accountResponse.ok) {
    throw new Error(
      `Failed to fetch account details: ${accountResponse.statusText}`
    );
  }

  const accountData = await accountResponse.json();
  return new Account(accountId, accountData.sequence);
}

// Function to create and prepare a Stellar contract transaction with multiple calls
// Ensure STELLAR_TESTNET_RPC_URL and NEXT_PUBLIC_STELLAR_NETWORK_PASSPHRASE are imported above

export async function createContractTransactionMulticall({
  contractAddress,
  operations,
  account,
  rpcUrl = STELLAR_TESTNET_RPC_URL,
  networkPassphrase = Networks.TESTNET,
  baseFeePerOperation = 100000, // Default base fee per operation, Soroban may adjust
}: {
  contractAddress: string;
  operations: Array<{
    method: string;
    args: xdr.ScVal[];
    // auth?: xdr.SorobanAuthorizationEntry[]; // Optional per-operation auth if needed
  }>;
  account: Account;
  rpcUrl?: string;
  networkPassphrase?: string;
  baseFeePerOperation?: number;
}): Promise<{
  transactionXDR: string;
  preparedTransaction: any; // Matching existing function's return type
}> {
  const server = new rpc.Server(rpcUrl, { allowHttp: true });

  const txBuilder = new TransactionBuilder(account, {
    fee: (baseFeePerOperation * operations.length).toString(),
    networkPassphrase,
  });

  for (const op of operations) {
    txBuilder.addOperation(
      Operation.invokeHostFunction({
        func: xdr.HostFunction.hostFunctionTypeInvokeContract(
          new xdr.InvokeContractArgs({
            contractAddress: Address.fromString(contractAddress).toScAddress(),
            functionName: op.method,
            args: op.args,
          })
        ),
        auth: [], // Defaulting to empty auth array, assuming source account signature is sufficient
      })
    );
  }

  const tx = txBuilder.setTimeout(TimeoutInfinite).build();
  console.log("Multicall transaction before prepare:", tx.toEnvelope().toXDR("base64"))
  // const preparedTransaction = await server.prepareTransaction(tx);

  // console.log("Multicall transaction after prepare:", preparedTransaction.toEnvelope().toXDR("base64"))

  return {
    transactionXDR: tx.toEnvelope().toXDR("base64"),
    // transactionXDR: preparedTransaction.toXDR(),
    preparedTransaction: tx.toEnvelope().toXDR("base64"),
  };
}

// Function to create and prepare a Stellar contract transaction
export async function createContractTransaction({
  contractAddress,
  method,
  account,
  args,
  rpcUrl = STELLAR_TESTNET_RPC_URL,
  networkPassphrase = Networks.TESTNET,
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
  // Create a Contract instance
  const contract = new Contract(contractAddress);

  // Create RPC server instance for preparing the transaction
  const server = new rpc.Server(rpcUrl, {
    allowHttp: rpcUrl.includes("localhost") || rpcUrl.includes("127.0.0.1"),
  });

  // Create the operation using the contract.call method
  const operation = contract.call(method, ...args);

  // Build the transaction
  const builtTransaction = new TransactionBuilder(account, {
    fee: BASE_FEE,
    networkPassphrase,
  })
    .addOperation(operation)
    .setTimeout(0)
    .build();

  // Get the XDR before preparing
  // const xdrBeforePrepare = builtTransaction.toEnvelope().toXDR("base64");

  // Prepare the transaction (simulate and discover storage footprint)
  let preparedTransaction;
  try {
    preparedTransaction = await server.prepareTransaction(builtTransaction);
  } catch (error) {
    console.error("Error preparing transaction:", error);
    throw error;
  }

  // Get the final XDR
  const transactionXDR = preparedTransaction.toEnvelope().toXDR("base64");

  return {
    transactionXDR,
    preparedTransaction,
  };
}

// Generate mock addresses for testing
export function generateMockAddresses() {
  const tokenAddress = `C${Buffer.from(randomUUID().replace(/-/g, "")).toString("hex").slice(0, 55)}`;
  const tokenManagerAddress = `C${Buffer.from(randomUUID().replace(/-/g, "")).toString("hex").slice(0, 55)}`;

  return {
    tokenAddress,
    tokenManagerAddress,
  };
}
