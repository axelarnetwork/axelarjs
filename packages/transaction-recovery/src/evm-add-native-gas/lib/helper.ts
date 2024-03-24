import {
  AxelarConfigClient,
  AxelarQueryAPIClient,
  ChainEvmSubconfig,
  GMPClient,
} from "@axelarjs/api";
import { Environment } from "@axelarjs/core";

import "viem/window";

import {
  createWalletClient,
  custom,
  Hash,
  http,
  publicActions,
  TransactionReceipt,
  WalletClient,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";

import { EvmAddNativeGasError } from "../error";
import { extractReceiptInfoForNativeGasPaid } from "../lib/getReceiptInfo";

/**
 * Get the address of the gas service contract from the chain config.
 * @param chainConfig  The chain config client.
 * @param env The environment. The environment can be "mainnet" or "testnet".
 * @param chain the source chain.
 * @returns The address of the gas service contract.
 */
export async function getGasServiceAddressFromChainConfig(
  configClient: AxelarConfigClient,
  env: Environment,
  chain: string
) {
  const _chainConfigs = await configClient.getAxelarConfigs(env);
  return (
    _chainConfigs.chains[chain.toLowerCase()]?.config as ChainEvmSubconfig
  ).contracts?.AxelarGasService?.address;
}

// Calculate the amount of native gas to be paid. If the amount is 0, then no native gas needs to be paid.
// Otherwise, the amount of native gas to be paid is the difference between the total amount of gas to be paid and the amount of gas already paid.
export async function calculateNativeGasFee(
  receipt: TransactionReceipt,
  sourceChain: string,
  destinationChain: string,
  estimatedGasUsed: number,
  axelarQueryClient: AxelarQueryAPIClient,
  gasMultiplier?: number
): Promise<bigint> {
  const stringTotalAmount = (await axelarQueryClient.estimateGasFee({
    sourceChain,
    destinationChain,
    gasLimit: BigInt(estimatedGasUsed),
    gasMultiplier: gasMultiplier || "auto",
  })) as string;

  const bigIntTotalAmount = BigInt(stringTotalAmount);

  const { paidFee } = extractReceiptInfoForNativeGasPaid(receipt);

  return paidFee >= bigIntTotalAmount ? BigInt(0) : bigIntTotalAmount - paidFee;
}

export async function isInsufficientFeeTx(
  client: GMPClient,
  txHash: Hash,
  logIndex: number
) {
  const gmpTxs = await client.searchGMP({
    txHash: txHash,
    txLogIndex: logIndex,
    size: 1,
  });

  const gmpTx = gmpTxs[0];

  return gmpTx?.gas_status === "gas_paid_not_enough_gas";
}

/**
 * Get the wallet client to send the native gas payment transaction. If the private key is not provided, then the browser-based wallet (window.ethereum) will be used.
 * @param rpcUrl - The RPC URL of the source chain.
 * @param privateKey - The private key of the sender.
 * @returns The wallet client to send the native gas payment transaction.
 */
export function getWalletClient(
  rpcUrl: string,
  privateKey?: `0x${string}`
): WalletClient {
  if (typeof window !== "undefined" && !window.ethereum) {
    throw EvmAddNativeGasError.WALLET_CLIENT_NOT_FOUND;
  }
  if (!privateKey) {
    throw EvmAddNativeGasError.WALLET_CLIENT_NOT_FOUND;
  }

  if (privateKey) {
    return createWalletClient({
      account: privateKeyToAccount(privateKey),
      transport: http(rpcUrl),
    }).extend(publicActions);
  } else {
    return createWalletClient({
      transport: custom(window.ethereum!),
    }).extend(publicActions);
  }
}
